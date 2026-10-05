import type { RowDataPacket } from "mysql2";
import { db } from "./db";
import { defaultCover } from "./covers";
import type { CommentItem, CoverConfig, Epigraph, Work } from "./types";

const SELECT_WORK = `
  SELECT w.*,
    (SELECT COUNT(*) FROM work_likes l WHERE l.work_id = w.id) AS likes,
    (SELECT COUNT(*) FROM comments c WHERE c.work_id = w.id) AS comments
  FROM works w`;

function parseJson<T>(raw: unknown, fallback: T): T {
  if (typeof raw !== "string") return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function toWork(r: RowDataPacket): Work {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    cover_title: r.cover_title,
    subtitle: r.subtitle,
    theme: r.theme,
    excerpt: r.excerpt,
    epigraphs: parseJson<Epigraph[]>(r.epigraphs, []),
    content: r.content,
    cover: { ...defaultCover, ...parseJson<Partial<CoverConfig>>(r.cover, {}) },
    published: !!r.published,
    views: r.views,
    created_at: new Date(r.created_at).toISOString(),
    likes: Number(r.likes),
    comments: Number(r.comments),
  };
}

export async function getWorks({ all = false } = {}) {
  const [rows] = await db.query<RowDataPacket[]>(
    `${SELECT_WORK} ${all ? "" : "WHERE w.published = 1"} ORDER BY w.created_at DESC, w.id DESC`
  );
  return rows.map(toWork);
}

export async function getWorkBySlug(slug: string) {
  const [rows] = await db.query<RowDataPacket[]>(`${SELECT_WORK} WHERE w.slug = ? AND w.published = 1`, [slug]);
  return rows[0] ? toWork(rows[0]) : null;
}

export async function getWorkById(id: number) {
  const [rows] = await db.query<RowDataPacket[]>(`${SELECT_WORK} WHERE w.id = ?`, [id]);
  return rows[0] ? toWork(rows[0]) : null;
}

export async function incrementViews(id: number) {
  await db.query("UPDATE works SET views = views + 1 WHERE id = ?", [id]);
}

export async function hasLiked(workId: number, visitor: string | null) {
  if (!visitor) return false;
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT 1 FROM work_likes WHERE work_id = ? AND visitor_id = ?",
    [workId, visitor]
  );
  return rows.length > 0;
}

export async function getComments(workId: number, visitor: string | null): Promise<CommentItem[]> {
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT c.*,
       (SELECT COUNT(*) FROM comment_likes cl WHERE cl.comment_id = c.id) AS likes,
       EXISTS(SELECT 1 FROM comment_likes cl WHERE cl.comment_id = c.id AND cl.visitor_id = ?) AS liked
     FROM comments c WHERE c.work_id = ? ORDER BY c.created_at ASC, c.id ASC`,
    [visitor ?? "", workId]
  );

  const items = rows.map(
    (r): CommentItem => ({
      id: r.id,
      parentId: r.parent_id,
      replyTo: r.reply_to,
      author: r.author,
      kind: r.kind,
      body: r.body,
      sticker: r.sticker,
      image: r.image,
      createdAt: new Date(r.created_at).toISOString(),
      likes: Number(r.likes),
      liked: !!r.liked,
      mine: !!visitor && r.visitor_id === visitor,
    })
  );

  const top = items.filter((c) => c.parentId === null).map((c) => ({ ...c, replies: [] as CommentItem[] }));
  const byId = new Map(top.map((c) => [c.id, c]));
  for (const c of items) if (c.parentId !== null) byId.get(c.parentId)?.replies.push(c);
  // Les plus récents d'abord ; les réponses restent dans l'ordre de la conversation.
  return top.reverse();
}

export async function getRecentComments(limit = 30) {
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT c.id, c.author, c.kind, c.body, c.sticker, c.image, c.created_at, c.parent_id,
            w.title AS work_title, w.slug AS work_slug
     FROM comments c JOIN works w ON w.id = c.work_id
     ORDER BY c.created_at DESC LIMIT ?`,
    [limit]
  );
  return rows.map((r) => ({
    id: r.id as number,
    author: r.author as string,
    kind: r.kind as string,
    body: r.body as string | null,
    sticker: r.sticker as string | null,
    image: r.image as string | null,
    isReply: r.parent_id !== null,
    createdAt: new Date(r.created_at).toISOString(),
    workTitle: r.work_title as string,
    workSlug: r.work_slug as string,
  }));
}

/** Découpe le texte en strophes (séparées par une ligne vide) ; les retours simples restent des vers. */
export function toVerses(content: string) {
  return content
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((l) => l.split("\n").map((v) => v.trim()).join("\n").trim())
    .filter(Boolean);
}

export function readingMinutes(content: string) {
  return Math.max(1, Math.round(content.split(/\s+/).length / 200));
}
