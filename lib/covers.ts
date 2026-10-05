import type { CoverConfig } from "./types";

export type Palette = {
  label: string;
  bg: string;
  bg2: string;
  ink: string;
  a: string;
  b: string;
  dark?: boolean;
};

export const palettes: Record<string, Palette> = {
  rose: { label: "Rose poudré", bg: "#fbe4e1", bg2: "#f5d2ce", ink: "#1b1b1b", a: "#c4473f", b: "#1f6f5c" },
  sauge: { label: "Sauge", bg: "#e4ede5", bg2: "#d2e2d5", ink: "#17231e", a: "#2a7a62", b: "#d46a64" },
  lavande: { label: "Lavande", bg: "#ebe6f3", bg2: "#dbd2ec", ink: "#1c1a2a", a: "#5a4a8c", b: "#c85f7c" },
  ivoire: { label: "Ivoire", bg: "#f6f0e5", bg2: "#ece1cc", ink: "#211d18", a: "#b0573a", b: "#3d5d70" },
  corail: { label: "Corail", bg: "#fde6d9", bg2: "#f8d0bd", ink: "#1b1b1b", a: "#d0462f", b: "#26496a" },
  brume: { label: "Brume", bg: "#e3eaf0", bg2: "#d0dbe6", ink: "#17212b", a: "#3a5e80", b: "#c76a6a" },
  nuit: { label: "Nuit", bg: "#20232f", bg2: "#2c3044", ink: "#f5ece6", a: "#eaa59c", b: "#8fbccd", dark: true },
};

export type Motif = { label: string; hint: string; keywords: string[]; palette: string; titlePos: "top" | "bottom" };

export const motifs: Record<string, Motif> = {
  sanctuaire: {
    label: "Sanctuaire & grandes eaux",
    hint: "Le passé, la cicatrice, ce qui demeure",
    keywords: ["passe", "sanctuaire", "cicatrice", "eaux", "mer", "blessure", "souvenir", "temps", "histoire", "avenir", "pelerin"],
    palette: "rose",
    titlePos: "top",
  },
  refuge: {
    label: "Deux âmes & la plume",
    hint: "La confiance, l'abandon, le refuge",
    keywords: ["abandon", "confiance", "refuge", "mains", "ensemble", "reciproque", "liberte", "deposer", "proteger", "confier"],
    palette: "sauge",
    titlePos: "bottom",
  },
  eveil: {
    label: "L'œil, le papillon & le pont",
    hint: "Voir, accepter, s'éveiller",
    keywords: ["voir", "yeux", "regard", "eveil", "verite", "lucidite", "papillon", "signe", "evidence", "accepter", "aveuglement"],
    palette: "lavande",
    titlePos: "top",
  },
  lunes: {
    label: "Phases de lune",
    hint: "La nuit, l'attente, les cycles",
    keywords: ["nuit", "lune", "insomnie", "attente", "cycle", "reve", "sommeil", "obscurite"],
    palette: "rose",
    titlePos: "top",
  },
  traits: {
    label: "Coups de pinceau",
    hint: "Le combat, la passion, la force",
    keywords: ["combat", "guerre", "force", "passion", "colere", "feu", "lutte", "bataille", "armes"],
    palette: "corail",
    titlePos: "bottom",
  },
  constellation: {
    label: "Constellation",
    hint: "Le ciel, le destin, l'infini",
    keywords: ["etoile", "ciel", "univers", "constellation", "destin", "celeste", "infini", "dieu", "grace"],
    palette: "nuit",
    titlePos: "top",
  },
  rose: {
    label: "La rose",
    hint: "La tendresse, la beauté, le désir",
    keywords: ["rose", "fleur", "beaute", "desir", "tendresse", "douceur", "femme", "jardin", "baiser"],
    palette: "ivoire",
    titlePos: "top",
  },
  pluie: {
    label: "Pluie & larme",
    hint: "Le manque, la tristesse, l'absence",
    keywords: ["larme", "pleurer", "tristesse", "pluie", "solitude", "absence", "manque", "silence", "perdre"],
    palette: "brume",
    titlePos: "top",
  },
};

export const defaultCover: CoverConfig = { motif: "rose", palette: "rose", seed: 1, titlePos: "top" };

const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

export function hashString(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Choisit un motif et une palette selon ce que raconte le texte. */
export function suggestCover(text: string): CoverConfig & { scores: Record<string, number> } {
  const words = normalize(text).split(/[^a-z]+/);
  const scores: Record<string, number> = {};
  for (const [key, m] of Object.entries(motifs)) {
    scores[key] = words.reduce((n, w) => n + (m.keywords.some((k) => w.startsWith(k)) ? 1 : 0), 0);
  }
  const best = Object.entries(scores).sort((x, y) => y[1] - x[1])[0];
  const motif = best && best[1] > 0 ? best[0] : "rose";
  const m = motifs[motif];
  return { motif, palette: m.palette, titlePos: m.titlePos, seed: hashString(text) % 997, scores };
}

/** Générateur pseudo-aléatoire déterministe (même graine = même couverture). */
export function rng(seed: number) {
  let a = seed >>> 0 || 1;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
