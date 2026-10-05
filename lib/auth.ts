import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "reve_admin";

export function adminToken() {
  const secret = process.env.ADMIN_SECRET || "reve-dev-secret";
  return createHmac("sha256", secret)
    .update(`admin:${process.env.ADMIN_PASSWORD || ""}`)
    .digest("hex");
}

export function checkPassword(candidate: string) {
  const expected = Buffer.from(process.env.ADMIN_PASSWORD || "");
  const given = Buffer.from(candidate);
  return expected.length > 0 && expected.length === given.length && timingSafeEqual(expected, given);
}

export async function isAdmin() {
  const value = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!value) return false;
  const a = Buffer.from(value);
  const b = Buffer.from(adminToken());
  return a.length === b.length && timingSafeEqual(a, b);
}
