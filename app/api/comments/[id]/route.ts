import type { RowDataPacket } from "mysql2";
import { isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { fail, json, parseId } from "@/lib/http";
import { readVisitor } from "@/lib/visitor";

/** Supprime un commentaire : son auteur (même navigateur) ou l'administrateur. */
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = parseId((await params).id);
  if (!id) return fail("Commentaire introuvable", 404);
  const [rows] = await db.query<RowDataPacket[]>("SELECT visitor_id FROM comments WHERE id = ?", [id]);
  if (!rows[0]) return fail("Commentaire introuvable", 404);

  const visitor = await readVisitor();
  if (rows[0].visitor_id !== visitor && !(await isAdmin())) return fail("Action non autorisée", 403);

  await db.query("DELETE FROM comments WHERE id = ?", [id]);
  return json({ ok: true });
}
