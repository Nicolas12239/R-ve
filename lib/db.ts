import mysql from "mysql2/promise";

const globalForDb = globalThis as unknown as { revePool?: mysql.Pool };

export const db =
  globalForDb.revePool ??
  mysql.createPool({
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "reve",
    charset: "utf8mb4",
    connectionLimit: 10,
    dateStrings: false,
  });

if (process.env.NODE_ENV !== "production") globalForDb.revePool = db;
