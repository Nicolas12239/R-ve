import type { RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const [rows] = await db.query<RowDataPacket[]>("SELECT slug FROM works WHERE published = 1 ORDER BY RAND() LIMIT 1");
  const target = rows[0] ? `/oeuvres/${rows[0].slug}` : "/oeuvres";
  return NextResponse.redirect(new URL(target, req.url));
}
