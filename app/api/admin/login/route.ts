import { ADMIN_COOKIE, adminToken, checkPassword } from "@/lib/auth";
import { fail, json } from "@/lib/http";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({ password: "" }));
  if (!checkPassword(String(password ?? ""))) {
    await new Promise((r) => setTimeout(r, 600));
    return fail("Mot de passe incorrect.", 401);
  }
  (await cookies()).set(ADMIN_COOKIE, adminToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 14,
  });
  return json({ ok: true });
}
