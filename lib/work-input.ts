import { motifs, palettes } from "./covers";
import type { CoverConfig, Epigraph } from "./types";
import { toVerses } from "./works";

export type WorkInput = {
  title: string;
  cover_title: string;
  subtitle: string | null;
  theme: string | null;
  excerpt: string | null;
  epigraphs: Epigraph[];
  content: string;
  cover: CoverConfig;
  published: boolean;
};

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Valide et normalise les données d'une œuvre envoyées par l'espace auteur. */
export function parseWorkInput(raw: unknown): WorkInput | string {
  if (!raw || typeof raw !== "object") return "Données invalides.";
  const r = raw as Record<string, unknown>;

  const title = str(r.title, 255);
  const content = str(r.content, 500_000).replace(/\r\n/g, "\n");
  if (!title) return "Le titre est obligatoire.";
  if (!content) return "Le texte est obligatoire.";

  const epigraphs = Array.isArray(r.epigraphs)
    ? r.epigraphs
        .map((e) => ({ text: str((e as Epigraph)?.text, 600), source: str((e as Epigraph)?.source, 160) }))
        .filter((e) => e.text)
        .slice(0, 6)
    : [];

  const c = (r.cover ?? {}) as Record<string, unknown>;
  const cover: CoverConfig = {
    motif: typeof c.motif === "string" && c.motif in motifs ? c.motif : "rose",
    palette: typeof c.palette === "string" && c.palette in palettes ? c.palette : "rose",
    seed: Number.isFinite(Number(c.seed)) ? Math.abs(Math.floor(Number(c.seed))) % 100000 : 1,
    titlePos: c.titlePos === "bottom" ? "bottom" : "top",
  };

  const verses = toVerses(content);
  const autoExcerpt = verses.find((v) => v.length > 30 && v.length < 140) ?? verses[0]?.slice(0, 140) ?? null;

  return {
    title,
    cover_title: str(r.cover_title, 120) || title.split(/[,:]/)[0].slice(0, 60),
    subtitle: str(r.subtitle, 255) || null,
    theme: str(r.theme, 160) || null,
    excerpt: str(r.excerpt, 600) || autoExcerpt,
    epigraphs,
    content,
    cover,
    published: r.published !== false,
  };
}
