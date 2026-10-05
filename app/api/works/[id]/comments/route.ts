import { existsSync } from "node:fs";
import path from "node:path";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { STICKERS } from "@/components/Stickers";
import { db } from "@/lib/db";
import { fail, json, parseId, UPLOAD_RE } from "@/lib/http";
import { getComments } from "@/lib/works";
import { ensureVisitor, readVisitor } from "@/lib/visitor";

const lastPost = new Map<string, number>();

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = parseId((await params).id);
  if (!id) return fail("Œuvre introuvable", 404);
  return json({ comments: await getComments(id, await readVisitor()) });
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const workId = parseId((await params).id);
  if (!workId) return fail("Œuvre introuvable", 404);
  const visitor = await ensureVisitor();

  const now = Date.now();
  if (now - (lastPost.get(visitor) ?? 0) < 3000) return fail("Doucement… laissez respirer les mots quelques secondes.", 429);

  const input = await req.json().catch(() => null);
  if (!input || typeof input !== "object") return fail("Requête invalide");

  const author = String(input.author ?? "").trim().slice(0, 40) || "Âme de passage";
  const kind = input.kind === "ecrit" ? "ecrit" : "texte";
  const body = typeof input.body === "string" ? input.body.trim().slice(0, kind === "ecrit" ? 4000 : 1500) : "";
  const sticker = typeof input.sticker === "string" && input.sticker in STICKERS ? input.sticker : null;
  let image: string | null = null;
  if (typeof input.image === "string" && UPLOAD_RE.test(input.image)) {
    if (existsSync(path.join(process.cwd(), "storage", "uploads", input.image))) image = input.image;
  }
  if (!body && !sticker && !image) return fail("Écrivez quelques mots, choisissez un sticker ou une photo.");

  const [works] = await db.query<RowDataPacket[]>("SELECT id FROM works WHERE id = ? AND published = 1", [workId]);
  if (!works[0]) return fail("Œuvre introuvable", 404);

  let parentId: number | null = null;
  let replyTo: string | null = null;
  if (input.parentId) {
    const [rows] = await db.query<RowDataPacket[]>("SELECT id, parent_id, author FROM comments WHERE id = ? AND work_id = ?", [
      Number(input.parentId),
      workId,
    ]);
    if (!rows[0]) return fail("Ce commentaire n'existe plus.", 404);
    // Fil à deux niveaux, comme TikTok : on répond toujours sous le commentaire racine.
    parentId = rows[0].parent_id ?? rows[0].id;
    replyTo = rows[0].parent_id ? rows[0].author : null;
  }

  const [res] = await db.query<ResultSetHeader>(
    `INSERT INTO comments (work_id, parent_id, reply_to, visitor_id, author, kind, body, sticker, image)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [workId, parentId, replyTo, visitor, author, kind, body || null, sticker, image]
  );
  lastPost.set(visitor, now);
  return json({ id: res.insertId }, 201);
}
