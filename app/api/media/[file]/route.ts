import { readFile } from "node:fs/promises";
import path from "node:path";
import { UPLOAD_RE } from "@/lib/http";

const TYPES: Record<string, string> = { jpg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif" };

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  if (!UPLOAD_RE.test(file)) return new Response("Introuvable", { status: 404 });
  try {
    const data = await readFile(path.join(process.cwd(), "storage", "uploads", file));
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": TYPES[file.split(".").pop()!],
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Introuvable", { status: 404 });
  }
}
