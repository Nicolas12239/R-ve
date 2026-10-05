// Crée la base `reve`, ses tables, puis insère les premiers récits (sans doublon).
// Usage : npm run db:setup
import { readFile } from "node:fs/promises";
import mysql from "mysql2/promise";
import { works } from "./works-data.mjs";

const dbName = process.env.DB_NAME || "reve";

const conn = await mysql.createConnection({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  multipleStatements: true,
  charset: "utf8mb4",
});

const schema = (await readFile(new URL("../database/schema.sql", import.meta.url), "utf8"))
  .replaceAll("`reve`", `\`${dbName}\``);
await conn.query(schema);
console.log(`✓ Base « ${dbName} » et tables prêtes`);

for (const w of works) {
  const [res] = await conn.query(
    `INSERT IGNORE INTO works (slug, title, cover_title, subtitle, theme, excerpt, epigraphs, content, cover)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      w.slug,
      w.title,
      w.cover_title,
      w.subtitle,
      w.theme,
      w.excerpt,
      JSON.stringify(w.epigraphs),
      w.content,
      JSON.stringify(w.cover),
    ]
  );
  console.log(res.affectedRows ? `✓ Ajouté : ${w.title}` : `• Déjà présent : ${w.title}`);
}

await conn.end();
