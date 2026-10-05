import type { ReactNode } from "react";
import { hashString, motifs, palettes, rng } from "@/lib/covers";
import type { CoverConfig } from "@/lib/types";

type Ctx = { id: string; p: (typeof palettes)[string]; r: () => number };

/** Couverture générée : aquarelle SVG + typographie, façon livre posé. */
export default function Cover({
  title,
  cover,
  className = "",
  priority = false,
}: {
  title: string;
  cover: CoverConfig;
  className?: string;
  priority?: boolean;
}) {
  const p = palettes[cover.palette] ?? palettes.rose;
  const motif = motifs[cover.motif] ? cover.motif : "rose";
  const id = `cv${hashString(`${motif}-${cover.palette}-${cover.seed}`)}`;
  const ctx: Ctx = { id, p, r: rng(cover.seed + 1) };
  const art = ART[motif](ctx);

  return (
    <div
      className={`cover ${p.dark ? "cover--dark" : ""} cover--${cover.titlePos} ${className}`}
      style={{ ["--cv-bg" as string]: p.bg, ["--cv-ink" as string]: p.ink }}
      data-priority={priority || undefined}
    >
      <svg className="cover__art" viewBox="0 0 300 420" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0" stopColor={p.bg} />
            <stop offset="1" stopColor={p.bg2} />
          </linearGradient>
          {(["a", "b"] as const).map((k) => (
            <radialGradient key={k} id={`${id}-g${k}`}>
              <stop offset="0" stopColor={p[k]} stopOpacity="0.42" />
              <stop offset="0.72" stopColor={p[k]} stopOpacity="0.7" />
              <stop offset="1" stopColor={p[k]} stopOpacity="0.95" />
            </radialGradient>
          ))}
          <filter id={`${id}-wc`} x="-25%" y="-25%" width="150%" height="150%">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed={cover.seed % 50} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="11" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id={`${id}-grain`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.16 0" />
          </filter>
        </defs>
        <rect width="300" height="420" fill={`url(#${id}-bg)`} />
        {art}
        <rect width="300" height="420" filter={`url(#${id}-grain)`} opacity={p.dark ? 0.5 : 0.9} />
      </svg>
      <span className="cover__spine-text">Un récit en vers · Rêve</span>
      <div className="cover__title">
        <i className="cover__dash" />
        {title}
      </div>
      <span className="cover__mark">Rêve</span>
    </div>
  );
}

/* ——— helpers ——— */

const wash = (c: Ctx, k: "a" | "b") => `url(#${c.id}-g${k})`;
const wc = (c: Ctx) => `url(#${c.id}-wc)`;

function wave(y: number, amp: number, len: number, closed = true) {
  let d = `M -30 ${y} q ${len / 4} ${-amp} ${len / 2} 0`;
  for (let x = -30 + len / 2; x < 340; x += len / 2) d += ` t ${len / 2} 0`;
  return closed ? `${d} V 440 H -30 Z` : d;
}

/* ——— motifs ——— */

const ART: Record<string, (c: Ctx) => ReactNode> = {
  // Le sanctuaire, les grandes eaux, la cicatrice recousue
  sanctuaire: (c) => {
    const arch = "M 92 380 V 258 A 58 58 0 0 1 208 258 V 380";
    const splashes = Array.from({ length: 7 }, () => [40 + c.r() * 220, 300 + c.r() * 40, 1.5 + c.r() * 3]);
    const stitches = Array.from({ length: 7 }, (_, i) => {
      const t = i / 6;
      const x = 120 + t * 60;
      const y = 214 + t * 96 + Math.sin(t * 6) * 4;
      return <path key={i} d={`M ${x - 5} ${y - 4} L ${x + 5} ${y + 4}`} />;
    });
    return (
      <g>
        <circle cx="150" cy="262" r="104" fill={wash(c, "a")} opacity="0.22" filter={wc(c)} />
        <path d={`${arch} Z`} fill={wash(c, "a")} opacity="0.62" filter={wc(c)} />
        <circle cx="150" cy="240" r="15" fill={c.p.bg} opacity="0.92" filter={wc(c)} />
        <g fill="none" stroke={c.p.ink} strokeLinecap="round">
          <path d={arch} strokeWidth="1.3" />
          <path d="M 82 380 V 258 A 68 68 0 0 1 218 258 V 380" strokeWidth="0.6" opacity="0.45" />
        </g>
        <g stroke={c.p.ink} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.85">
          <path d="M 120 214 C 135 245, 160 270, 180 310" />
          {stitches}
        </g>
        <g filter={wc(c)}>
          <path d={wave(338, 7, 64)} fill={wash(c, "b")} opacity="0.35" />
          <path d={wave(356, 8, 54)} fill={wash(c, "b")} opacity="0.5" />
          <path d={wave(376, 6, 72)} fill={wash(c, "b")} opacity="0.75" />
        </g>
        {splashes.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill={c.p.b} opacity="0.45" />
        ))}
      </g>
    );
  },

  // Deux âmes qui se rejoignent, une plume qui se dépose
  refuge: (c) => {
    const barbs: ReactNode[] = [];
    for (let i = 1; i < 22; i++) {
      const t = i / 22;
      const y = -84 * t;
      const x = Math.sin(t * Math.PI) * 4;
      const len = 3 + 16 * Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.15)), 0.8);
      barbs.push(<path key={`l${i}`} d={`M ${x} ${y} Q ${x - len * 0.6} ${y - 2} ${x - len} ${y - len * 0.55}`} />);
      barbs.push(<path key={`r${i}`} d={`M ${x} ${y} Q ${x + len * 0.6} ${y - 2} ${x + len} ${y - len * 0.55}`} />);
    }
    const dust = Array.from({ length: 9 }, () => [60 + c.r() * 190, 40 + c.r() * 250, 0.8 + c.r() * 1.8]);
    return (
      <g>
        <g style={{ mixBlendMode: c.p.dark ? "screen" : "multiply" }} filter={wc(c)}>
          <circle cx="124" cy="162" r="68" fill={wash(c, "a")} opacity="0.85" />
          <circle cx="184" cy="190" r="64" fill={wash(c, "b")} opacity="0.75" />
        </g>
        <path
          d="M 222 104 C 250 140, 178 128, 158 176"
          fill="none"
          stroke={c.p.ink}
          strokeWidth="0.8"
          strokeDasharray="2 5"
          strokeLinecap="round"
          opacity="0.6"
        />
        <g transform="translate(222 100) rotate(32)" stroke={c.p.ink} fill="none" strokeLinecap="round">
          <path d="M 0 14 Q 4 -40 0 -86" strokeWidth="1.1" />
          <g strokeWidth="0.55" opacity="0.75">{barbs}</g>
        </g>
        {dust.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill={c.p.ink} opacity="0.35" />
        ))}
      </g>
    );
  },

  // L'œil qui accepte de voir, le papillon, le pont suspendu entre le réel et le désir
  eveil: (c) => {
    const P0 = [62, 270], P1 = [150, 196], P2 = [238, 270];
    const lashes = Array.from({ length: 9 }, (_, i) => {
      const t = 0.12 + i * 0.095;
      const x = (1 - t) ** 2 * P0[0] + 2 * (1 - t) * t * P1[0] + t ** 2 * P2[0];
      const y = (1 - t) ** 2 * P0[1] + 2 * (1 - t) * t * P1[1] + t ** 2 * P2[1];
      const dx = (t - 0.5) * 14;
      return <path key={i} d={`M ${x} ${y - 2} L ${x + dx} ${y - 13}`} />;
    });
    const hangers: ReactNode[] = [];
    for (let x = 78; x < 230; x += 9) {
      const t = (x - 70) / 160;
      const y = (1 - t) ** 2 * 352 + 2 * (1 - t) * t * 424 + t ** 2 * 352;
      if (y < 396) hangers.push(<path key={x} d={`M ${x} ${y} V 398`} />);
    }
    const almond = "M 62 270 Q 150 196 238 270 Q 150 344 62 270 Z";
    return (
      <g>
        <clipPath id={`${c.id}-eye`}>
          <path d={almond} />
        </clipPath>
        <g clipPath={`url(#${c.id}-eye)`}>
          <rect x="60" y="190" width="180" height="160" fill={c.p.bg} opacity="0.7" />
          <circle cx="150" cy="270" r="38" fill={wash(c, "a")} filter={wc(c)} />
          <circle cx="150" cy="270" r="13" fill={c.p.ink} />
          <circle cx="158" cy="262" r="4" fill={c.p.bg} />
        </g>
        <g fill="none" stroke={c.p.ink} strokeLinecap="round">
          <path d={almond} strokeWidth="1.4" />
          <g strokeWidth="1">{lashes}</g>
        </g>
        <g transform="translate(222 172) rotate(-14) scale(0.95)" filter={wc(c)}>
          {[1, -1].map((s) => (
            <g key={s} transform={`scale(${s} 1)`}>
              <path d="M 0 0 C -10 -32, -44 -34, -40 -6 C -38 8, -14 8, 0 0 Z" fill={wash(c, "b")} />
              <path d="M 0 0 C -6 18, -28 30, -27 15 C -26 5, -12 2, 0 0 Z" fill={wash(c, "a")} opacity="0.85" />
            </g>
          ))}
        </g>
        <path d="M 222 160 V 186 M 222 160 q -4 -10 -10 -12 M 222 160 q 4 -10 10 -12" transform="rotate(-14 222 172)" stroke={c.p.ink} strokeWidth="1" fill="none" strokeLinecap="round" />
        <g stroke={c.p.ink} fill="none" strokeLinecap="round" opacity="0.8">
          <path d="M 20 380 Q 50 362 70 352 Q 150 424 230 352 Q 250 362 280 380" strokeWidth="0.9" />
          <path d="M 70 340 V 400 M 230 340 V 400" strokeWidth="1.6" />
          <path d="M 10 399 H 290" strokeWidth="1.2" />
          <g strokeWidth="0.5">{hangers}</g>
        </g>
        <path d={wave(408, 3, 40)} fill={wash(c, "b")} opacity="0.45" filter={wc(c)} />
      </g>
    );
  },

  // Les phases de lune (hommage aux couvertures d'origine)
  lunes: (c) => {
    const moons: ReactNode[] = [];
    for (let k = 0; k < 12; k++) {
      const col = k % 3, row = Math.floor(k / 3);
      const cx = 150 + col * 48, cy = 176 + row * 60, r = 20;
      const color = (["a", "b", "ink"] as const)[Math.floor(c.r() * 3)];
      const off = k < 3 ? 99 : (col === 2 ? -1 : 1) * r * (0.35 + 0.14 * (k - 3));
      moons.push(
        <g key={k}>
          <mask id={`${c.id}-m${k}`}>
            <rect x="0" y="0" width="300" height="420" fill="white" />
            <circle cx={cx + off} cy={cy} r={r} fill="black" />
          </mask>
          <circle
            cx={cx}
            cy={cy}
            r={r}
            mask={`url(#${c.id}-m${k})`}
            fill={color === "ink" ? c.p.ink : wash(c, color)}
            opacity={color === "ink" ? 0.8 : 1}
            filter={wc(c)}
          />
        </g>
      );
    }
    return <g>{moons}</g>;
  },

  // Coups de pinceau : la lutte, la passion
  traits: (c) => (
    <g filter={wc(c)} strokeLinecap="round" fill="none">
      {Array.from({ length: 5 }, (_, i) => {
        const x = 120 + i * 46;
        const len = 260 + c.r() * 60;
        const d = `M ${x} -20 C ${x - 20} ${len * 0.35}, ${x - 70} ${len * 0.6}, ${x - 108} ${len}`;
        return (
          <g key={i}>
            <path d={d} stroke={i % 2 ? c.p.a : c.p.b} strokeWidth={14 + c.r() * 6} opacity="0.85" />
            <path d={d} stroke={c.p.bg} strokeWidth="3" strokeDasharray={`${20 + c.r() * 40} ${8 + c.r() * 20}`} opacity="0.35" />
          </g>
        );
      })}
    </g>
  ),

  // Constellation : le destin écrit dans le ciel
  constellation: (c) => {
    const stars = Array.from({ length: 15 }, () => [60 + c.r() * 210, 170 + c.r() * 225, 1.2 + c.r() * 2]);
    const path = stars.slice(0, 7).sort((a, b) => a[0] - b[0]).map(([x, y], i) => `${i ? "L" : "M"} ${x} ${y}`).join(" ");
    const sparkle = (x: number, y: number, s: number, k: number) => (
      <path key={k} transform={`translate(${x} ${y}) scale(${s})`} d="M 0 -10 Q 1.5 -1.5 10 0 Q 1.5 1.5 0 10 Q -1.5 1.5 -10 0 Q -1.5 -1.5 0 -10 Z" fill={c.p.a} />
    );
    return (
      <g>
        <circle cx="196" cy="262" r="72" fill={wash(c, "b")} opacity="0.55" filter={wc(c)} />
        <path d={path} fill="none" stroke={c.p.ink} strokeWidth="0.7" opacity="0.55" />
        {stars.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill={c.p.ink} opacity={0.6 + (i % 3) * 0.15} />
        ))}
        {sparkle(92, 200, 1, 1)}
        {sparkle(250, 360, 0.7, 2)}
        {sparkle(140, 380, 0.5, 3)}
      </g>
    );
  },

  // La rose
  rose: (c) => (
    <g>
      <g filter={wc(c)}>
        <path d="M 165 262 C 158 310, 178 350, 152 412" fill="none" stroke={c.p.b} strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="150" cy="322" rx="24" ry="9" transform="rotate(-30 150 322)" fill={wash(c, "b")} />
        <ellipse cx="182" cy="356" rx="22" ry="8" transform="rotate(28 182 356)" fill={wash(c, "b")} />
        {Array.from({ length: 8 }, (_, i) => (
          <ellipse
            key={i}
            cx={165 + Math.cos(i * 0.9) * (12 - i)}
            cy={232 + Math.sin(i * 0.9) * (10 - i)}
            rx={42 - i * 4}
            ry={30 - i * 2.5}
            transform={`rotate(${i * 47 + c.r() * 10} 165 232)`}
            fill={wash(c, "a")}
            opacity="0.42"
          />
        ))}
      </g>
      <path
        d="M 165 232 m -3 0 a 3 3 0 1 1 6 0 a 7 7 0 1 1 -14 0 a 12 12 0 1 1 24 0 a 18 16 0 1 1 -36 2"
        fill="none"
        stroke={c.p.ink}
        strokeWidth="0.9"
        opacity="0.7"
        strokeLinecap="round"
      />
    </g>
  ),

  // Pluie et larme : le manque
  pluie: (c) => (
    <g>
      <g stroke={c.p.b} strokeLinecap="round" opacity="0.55">
        {Array.from({ length: 42 }, (_, i) => {
          const x = 30 + c.r() * 260, y = 150 + c.r() * 250, l = 12 + c.r() * 24;
          return <path key={i} d={`M ${x} ${y} l ${-l * 0.18} ${l}`} strokeWidth={0.8 + c.r()} />;
        })}
      </g>
      <path
        transform="translate(176 300)"
        d="M 0 -64 C 18 -32, 36 -8, 36 14 A 36 36 0 0 1 -36 14 C -36 -8, -18 -32, 0 -64 Z"
        fill={wash(c, "a")}
        filter={wc(c)}
      />
      <g fill="none" stroke={c.p.b} opacity="0.5" strokeWidth="0.8">
        <ellipse cx="176" cy="398" rx="44" ry="5" />
        <ellipse cx="176" cy="398" rx="26" ry="3" />
      </g>
    </g>
  ),
};
