import type { ReactNode } from "react";

const R = "#e0524b";
const RL = "#f6c9c4";
const G = "#2a7a62";
const GL = "#cfe5da";
const INK = "#1c1c1c";
const L = "#6c5aa0";
const LL = "#ded6ef";
const GOLD = "#e3a83b";

const word = (text: string, bg: string, fg = "#fff", rot = -6) => (
  <g transform={`rotate(${rot} 32 32)`}>
    <rect x="3" y="18" width="58" height="28" rx="14" fill={bg} />
    <rect x="3" y="18" width="58" height="28" rx="14" fill="none" stroke="#fff" strokeWidth="2.5" />
    <text x="32" y="37" textAnchor="middle" fontFamily="Playfair Display, Georgia, serif" fontStyle="italic" fontWeight="700" fontSize="13" fill={fg}>
      {text}
    </text>
  </g>
);

export const STICKERS: Record<string, { label: string; svg: ReactNode }> = {
  coeur: {
    label: "Cœur",
    svg: (
      <>
        <path d="M32 54 C10 40 6 28 10 19 C15 9 28 9 32 19 C36 9 49 9 54 19 C58 28 54 40 32 54Z" fill={R} stroke="#fff" strokeWidth="3" />
        <path d="M18 22 C20 17 25 16 27 18" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".7" />
      </>
    ),
  },
  "coeur-brise": {
    label: "Cœur brisé",
    svg: (
      <>
        <path d="M30 52 C10 40 6 28 10 19 C15 9 26 9 30 18 L26 28 L33 34 L28 44Z" fill={R} stroke="#fff" strokeWidth="2.5" />
        <path d="M35 52 C54 40 58 28 54 19 C49 9 39 9 35 17 L31 27 L38 33 L33 44Z" fill={R} stroke="#fff" strokeWidth="2.5" transform="translate(2 2) rotate(6 40 30)" />
      </>
    ),
  },
  plume: {
    label: "Plume",
    svg: (
      <>
        <path d="M50 8 C30 12 18 28 16 50 C30 46 44 34 50 8Z" fill={LL} stroke={L} strokeWidth="2" />
        <path d="M48 11 C38 24 26 38 12 56" stroke={INK} strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M24 38 l8 2 M30 30 l8 1 M36 22 l7 1" stroke={L} strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
  },
  rose: {
    label: "Rose",
    svg: (
      <>
        <path d="M32 34 C30 44 34 50 30 60" stroke={G} strokeWidth="3" fill="none" strokeLinecap="round" />
        <ellipse cx="24" cy="46" rx="8" ry="4" transform="rotate(-30 24 46)" fill={G} />
        <circle cx="32" cy="22" r="15" fill={R} stroke="#fff" strokeWidth="2.5" />
        <path d="M32 22 m-2 0 a2 2 0 1 1 4 0 a5 5 0 1 1 -10 0 a8 8 0 1 1 16 0" stroke="#fff" strokeWidth="1.8" fill="none" opacity=".8" />
      </>
    ),
  },
  lune: {
    label: "Lune",
    svg: (
      <>
        <path d="M40 8 A24 24 0 1 0 56 44 A19 19 0 1 1 40 8Z" fill={GOLD} stroke="#fff" strokeWidth="3" />
        <circle cx="50" cy="14" r="2" fill={GOLD} />
        <circle cx="56" cy="24" r="1.4" fill={GOLD} />
      </>
    ),
  },
  larme: {
    label: "Larme",
    svg: (
      <>
        <path d="M32 6 C40 20 50 30 50 40 A18 18 0 0 1 14 40 C14 30 24 20 32 6Z" fill="#8fb8d6" stroke="#fff" strokeWidth="3" />
        <path d="M22 40 a10 10 0 0 0 8 10" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".8" />
      </>
    ),
  },
  flamme: {
    label: "Flamme",
    svg: (
      <>
        <path d="M32 58 C16 58 12 44 18 34 C22 28 22 20 20 12 C30 16 36 24 36 30 C40 26 40 22 40 18 C50 28 52 40 46 50 C43 55 38 58 32 58Z" fill="#f08a4b" stroke="#fff" strokeWidth="3" />
        <path d="M32 54 C26 54 24 48 27 43 C29 40 30 36 30 34 C36 38 40 44 37 50 C36 52 34 54 32 54Z" fill={GOLD} />
      </>
    ),
  },
  papillon: {
    label: "Papillon",
    svg: (
      <>
        <path d="M32 30 C26 12 8 8 8 22 C8 32 20 34 32 32Z" fill={LL} stroke={L} strokeWidth="2" />
        <path d="M32 30 C38 12 56 8 56 22 C56 32 44 34 32 32Z" fill={RL} stroke={R} strokeWidth="2" />
        <path d="M32 33 C24 36 14 46 20 52 C26 56 30 44 32 36Z" fill={RL} stroke={R} strokeWidth="2" />
        <path d="M32 33 C40 36 50 46 44 52 C38 56 34 44 32 36Z" fill={LL} stroke={L} strokeWidth="2" />
        <path d="M32 22 V48 M32 22 q-3 -8 -8 -10 M32 22 q3 -8 8 -10" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" />
      </>
    ),
  },
  etoile: {
    label: "Étoile",
    svg: <path d="M32 4 C34 22 42 30 60 32 C42 34 34 42 32 60 C30 42 22 34 4 32 C22 30 30 22 32 4Z" fill={GOLD} stroke="#fff" strokeWidth="3" />,
  },
  oeil: {
    label: "Je vois",
    svg: (
      <>
        <path d="M4 32 Q32 6 60 32 Q32 58 4 32Z" fill="#fff" stroke={INK} strokeWidth="2.5" />
        <circle cx="32" cy="32" r="12" fill={L} />
        <circle cx="32" cy="32" r="5" fill={INK} />
        <circle cx="35" cy="29" r="2" fill="#fff" />
      </>
    ),
  },
  lettre: {
    label: "Lettre",
    svg: (
      <>
        <rect x="6" y="16" width="52" height="34" rx="4" fill="#fff" stroke={INK} strokeWidth="2.5" />
        <path d="M6 18 L32 36 L58 18" stroke={INK} strokeWidth="2.5" fill="none" />
        <path d="M32 44 C26 40 24 36 27 33 C29 31 31 32 32 34 C33 32 35 31 37 33 C40 36 38 40 32 44Z" fill={R} />
      </>
    ),
  },
  frissons: { label: "Frissons", svg: word("Frissons", R) },
  bravo: { label: "Bravo", svg: word("Bravo !", G, "#fff", 5) },
  encore: { label: "Encore", svg: word("Encore…", INK, "#fff", -3) },
  touche: { label: "Touché", svg: word("Touché", L, "#fff", 4) },
  merci: { label: "Merci", svg: word("Merci", "#f2b8b2", INK, -5) },
};

export function Sticker({ name, size = 64 }: { name: string; size?: number }) {
  const s = STICKERS[name];
  if (!s) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label={s.label} className="sticker">
      {s.svg}
    </svg>
  );
}
