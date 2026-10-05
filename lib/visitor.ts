import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";

const COOKIE = "reve_v";

/** Lecture seule (pages serveur). */
export async function readVisitor() {
  return (await cookies()).get(COOKIE)?.value ?? null;
}

/** Lit ou crée l'identifiant anonyme du visiteur (route handlers uniquement). */
export async function ensureVisitor() {
  const store = await cookies();
  let id = store.get(COOKIE)?.value;
  if (!id || !/^[0-9a-f-]{36}$/.test(id)) {
    id = randomUUID();
    store.set(COOKIE, id, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365 * 2,
    });
  }
  return id;
}
