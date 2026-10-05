import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { fail, json } from "@/lib/http";
import { slugify } from "@/lib/slug";
import { parseWorkInput } from "@/lib/work-input";

export async function POST(req: Request) {
  if (!(await isAdmin())) return fail("Accès réservé à l'auteur.", 401);
  const input = parseWorkInput(await req.json().catch(() => null));
  if (typeof input === "string") return fail(input);

  const base = slugify(input.title) || "recit";
  let slug = base;
  for (let i = 2; ; i++) {
    const [rows] = await db.query<RowDataPacket[]>("SELECT 1 FROM works WHERE slug = ?", [slug]);
    if (!rows.length) break;
    slug = `${base}-${i}`;
  }

  const [res] = await db.query<ResultSetHeader>(
    `INSERT INTO works (slug, title, cover_title, subtitle, theme, excerpt, epigraphs, content, cover, published)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      slug,
      input.title,
      input.cover_title,
      input.subtitle,
      input.theme,
      input.excerpt,
      JSON.stringify(input.epigraphs),
      input.content,
      JSON.stringify(input.cover),
      input.published ? 1 : 0,
    ]
  );
  return json({ id: res.insertId, slug }, 201);
}
