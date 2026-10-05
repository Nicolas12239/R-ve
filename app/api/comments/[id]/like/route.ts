import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import { fail, json, parseId } from "@/lib/http";
import { ensureVisitor } from "@/lib/visitor";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = parseId((await params).id);
  if (!id) return fail("Commentaire introuvable", 404);
  const visitor = await ensureVisitor();

  const [del] = await db.query<ResultSetHeader>("DELETE FROM comment_likes WHERE comment_id = ? AND visitor_id = ?", [id, visitor]);
  const liked = del.affectedRows === 0;
  if (liked) {
    try {
      await db.query("INSERT INTO comment_likes (comment_id, visitor_id) VALUES (?, ?)", [id, visitor]);
    } catch {
      return fail("Commentaire introuvable", 404);
    }
  }
  const [[row]] = await db.query<RowDataPacket[]>("SELECT COUNT(*) AS n FROM comment_likes WHERE comment_id = ?", [id]);
  return json({ liked, count: Number(row.n) });
}
