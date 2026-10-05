"use client";

import { useEffect, useRef, useState } from "react";
import { CommentIcon, HeartIcon, ShareIcon, TextSizeIcon } from "../Icons";
import { useWork } from "./WorkContext";

type Theme = "jour" | "sepia" | "nuit";
const SIZES = [19, 21, 23, 25, 27, 30];

function load<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* stockage indisponible */
  }
}

/** Surface de lecture : thème, taille du texte, barre de progression et rail d'actions. */
export default function Reader({ children }: { children: React.ReactNode }) {
  const { liked, likes, pop, comments, toggleLike, openComments, share } = useWork();
  const ref = useRef<HTMLElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<Theme>("jour");
  const [size, setSize] = useState<number | null>(null);
  const [railOn, setRailOn] = useState(false);
  const [panel, setPanel] = useState(false);

  useEffect(() => {
    setTheme(load<Theme>("reve_theme", "jour"));
    setSize(load<number | null>("reve_size", null));
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.4 - r.top) / (r.height - vh * 0.6)));
      bar.current?.style.setProperty("--p", String(p));
      setRailOn(r.top < vh * 0.65);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("reader-active-nuit", theme === "nuit" && railOn);
    return () => document.body.classList.remove("reader-active-nuit");
  }, [theme, railOn]);

  const pickTheme = (t: Theme) => {
    setTheme(t);
    save("reve_theme", t);
  };
  const bump = (d: number) => {
    const current = size ?? (window.innerWidth < 820 ? 21 : 25);
    const i = Math.max(0, Math.min(SIZES.length - 1, SIZES.indexOf(SIZES.reduce((a, b) => (Math.abs(b - current) < Math.abs(a - current) ? b : a))) + d));
    setSize(SIZES[i]);
    save("reve_size", SIZES[i]);
  };

  return (
    <>
      <div className="progress" ref={bar} aria-hidden="true" />
      <article
        id="lecture"
        ref={ref}
        className="reader"
        data-theme={theme}
        style={size ? ({ ["--verse-size" as string]: `${size}px` } as React.CSSProperties) : undefined}
      >
        {children}
      </article>

      <aside className={`rail ${railOn ? "is-on" : ""}`} aria-label="Actions">
        <button className={`rail__btn ${liked ? "is-liked" : ""}`} onClick={toggleLike} aria-pressed={liked}>
          <span className="rail__icon" key={pop}>
            <HeartIcon filled={liked} className={pop ? "heart-pop" : undefined} />
          </span>
          {likes}
          <span className="sr-only">j'aime</span>
        </button>
        <button className="rail__btn" onClick={openComments}>
          <span className="rail__icon">
            <CommentIcon />
          </span>
          {comments}
          <span className="sr-only">commentaires</span>
        </button>
        <button className="rail__btn" onClick={share}>
          <span className="rail__icon">
            <ShareIcon />
          </span>
          Partager
        </button>
        <div style={{ position: "relative" }}>
          <button className="rail__btn" onClick={() => setPanel((p) => !p)} aria-expanded={panel}>
            <span className="rail__icon">
              <TextSizeIcon />
            </span>
            Lecture
          </button>
          {panel && (
            <div className="aa-panel">
              <span>Taille du texte</span>
              <div className="aa-panel__row">
                <button onClick={() => bump(-1)} aria-label="Réduire">
                  A−
                </button>
                <button onClick={() => bump(1)} aria-label="Agrandir" style={{ fontSize: 17 }}>
                  A+
                </button>
              </div>
              <span>Ambiance</span>
              <div className="aa-panel__row">
                <button aria-pressed={theme === "jour"} onClick={() => pickTheme("jour")}>
                  Jour
                </button>
                <button className="swatch-sepia" aria-pressed={theme === "sepia"} onClick={() => pickTheme("sepia")}>
                  Sépia
                </button>
                <button className="swatch-nuit" aria-pressed={theme === "nuit"} onClick={() => pickTheme("nuit")}>
                  Nuit
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
