import type { ResultSetHeader } from "mysql2";
import { isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { fail, json, parseId } from "@/lib/http";
import { parseWorkInput } from "@/lib/work-input";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Ctx) {
  if (!(await isAdmin())) return fail("Accès réservé à l'auteur.", 401);
  const id = parseId((await params).id);
  if (!id) return fail("Œuvre introuvable", 404);
  const input = parseWorkInput(await req.json().catch(() => null));
  if (typeof input === "string") return fail(input);

  const [res] = await db.query<ResultSetHeader>(
    `UPDATE works SET title = ?, cover_title = ?, subtitle = ?, theme = ?, excerpt = ?, epigraphs = ?,
       content = ?, cover = ?, published = ? WHERE id = ?`,
    [
      input.title,
      input.cover_title,
      input.subtitle,
      input.theme,
      input.excerpt,
      JSON.stringify(input.epigraphs),
      input.content,
      JSON.stringify(input.cover),
      input.published ? 1 : 0,
      id,
    ]
  );
  if (!res.affectedRows) return fail("Œuvre introuvable", 404);
  return json({ ok: true });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await isAdmin())) return fail("Accès réservé à l'auteur.", 401);
  const id = parseId((await params).id);
  if (!id) return fail("Œuvre introuvable", 404);
  await db.query("DELETE FROM works WHERE id = ?", [id]);
  return json({ ok: true });
}
