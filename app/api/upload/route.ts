import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fail, json } from "@/lib/http";
import { ensureVisitor } from "@/lib/visitor";

const MAX = 6 * 1024 * 1024;

function detect(buf: Buffer) {
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpg";
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png";
  if (buf.subarray(0, 4).toString() === "RIFF" && buf.subarray(8, 12).toString() === "WEBP") return "webp";
  if (buf.subarray(0, 4).toString() === "GIF8") return "gif";
  return null;
}

export async function POST(req: Request) {
  await ensureVisitor();
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return fail("Aucune image reçue.");
  if (file.size > MAX) return fail("Image trop lourde (6 Mo maximum).", 413);

  const buf = Buffer.from(await file.arrayBuffer());
  const ext = detect(buf);
  if (!ext) return fail("Formats acceptés : JPG, PNG, WEBP ou GIF.", 415);

  const dir = path.join(process.cwd(), "storage", "uploads");
  await mkdir(dir, { recursive: true });
  const name = `${randomUUID()}.${ext}`;
  await writeFile(path.join(dir, name), buf);
  return json({ file: name }, 201);
}
