"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Cover from "@/components/Cover";
import { motifs, palettes, suggestCover } from "@/lib/covers";
import type { CoverConfig, Epigraph, Work } from "@/lib/types";
import DeleteButton from "./DeleteButton";

export default function WorkEditor({ work }: { work?: Work }) {
  const router = useRouter();
  const [title, setTitle] = useState(work?.title ?? "");
  const [coverTitle, setCoverTitle] = useState(work?.cover_title ?? "");
  const [subtitle, setSubtitle] = useState(work?.subtitle ?? "");
  const [theme, setTheme] = useState(work?.theme ?? "");
  const [excerpt, setExcerpt] = useState(work?.excerpt ?? "");
  const [epigraphs, setEpigraphs] = useState<Epigraph[]>(work?.epigraphs ?? []);
  const [content, setContent] = useState(work?.content ?? "");
  const [published, setPublished] = useState(work?.published ?? true);
  const [cover, setCover] = useState<CoverConfig>(
    work?.cover ?? { motif: "rose", palette: "rose", seed: 1, titlePos: "top" }
  );
  const [coverTouched, setCoverTouched] = useState(!!work);
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const shownTitle = coverTitle || title.split(/[,:]/)[0] || "Titre";

  function inspire() {
    const text = `${title}\n${subtitle}\n${theme}\n${content}`;
    if (text.trim().length < 20) {
      setNote("Écrivez ou collez d'abord le texte : la couverture s'en inspirera.");
      return;
    }
    const s = suggestCover(text);
    setCover({ motif: s.motif, palette: s.palette, seed: s.seed, titlePos: s.titlePos });
    setCoverTouched(true);
    setNote(`Inspirée du texte : « ${motifs[s.motif].label} » — ${motifs[s.motif].hint.toLowerCase()}.`);
  }

  const update = (patch: Partial<CoverConfig>) => {
    setCover((c) => ({ ...c, ...patch }));
    setCoverTouched(true);
  };

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    // Si l'auteur n'a pas touché à la couverture, on la crée d'après le texte.
    let finalCover = cover;
    if (!coverTouched) {
      const s = suggestCover(`${title}\n${subtitle}\n${theme}\n${content}`);
      finalCover = { motif: s.motif, palette: s.palette, seed: s.seed, titlePos: s.titlePos };
    }
    const res = await fetch(work ? `/api/admin/works/${work.id}` : "/api/admin/works", {
      method: work ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        cover_title: coverTitle,
        subtitle,
        theme,
        excerpt,
        epigraphs,
        content,
        cover: finalCover,
        published,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error ?? "L'enregistrement a échoué.");
      setSaving(false);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <form className="editor" onSubmit={save}>
      <div>
        <div className="field">
          <label htmlFor="title">Titre</label>
          <input id="title" className="input input--title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Le titre de votre récit" />
        </div>
        <div className="field">
          <label htmlFor="ctitle">Titre sur la couverture</label>
          <input id="ctitle" className="input" value={coverTitle} onChange={(e) => setCoverTitle(e.target.value)} maxLength={120} placeholder="Plus court, ex. « L'Abandon »" />
        </div>
        <div className="field">
          <label htmlFor="subtitle">Sous-titre</label>
          <input id="subtitle" className="input" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Facultatif" />
        </div>
        <div className="field">
          <label htmlFor="theme">Thèmes</label>
          <input id="theme" className="input" value={theme} onChange={(e) => setTheme(e.target.value)} placeholder="ex. Amour · Confiance · Abandon" />
        </div>

        <div className="field">
          <span className="field-label">Épigraphes</span>
          {epigraphs.map((ep, i) => (
            <div key={i} className="epigraph-row">
              <input
                className="input"
                value={ep.text}
                placeholder="La citation"
                onChange={(e) => setEpigraphs((l) => l.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)))}
              />
              <input
                className="input"
                value={ep.source}
                placeholder="Source"
                onChange={(e) => setEpigraphs((l) => l.map((x, j) => (j === i ? { ...x, source: e.target.value } : x)))}
              />
              <button type="button" className="icon-btn" onClick={() => setEpigraphs((l) => l.filter((_, j) => j !== i))} aria-label="Retirer">
                ✕
              </button>
            </div>
          ))}
          {epigraphs.length < 6 && (
            <button type="button" className="btn btn--sm" style={{ justifySelf: "start" }} onClick={() => setEpigraphs((l) => [...l, { text: "", source: "" }])}>
              + Ajouter une épigraphe
            </button>
          )}
        </div>

        <div className="field">
          <label htmlFor="content">Le texte</label>
          <small>Une ligne vide sépare les strophes ; un simple retour à la ligne garde vos vers ensemble.</small>
          <textarea id="content" className="textarea textarea--verse" value={content} onChange={(e) => setContent(e.target.value)} required />
        </div>

        <div className="field">
          <label htmlFor="excerpt">Extrait mis en avant</label>
          <small>La phrase qui donnera envie de lire. Laissée vide, une ligne du texte sera choisie.</small>
          <textarea id="excerpt" className="textarea" rows={2} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
        </div>

        <label className="check" style={{ marginBottom: 28 }}>
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
          Publier ce récit (sinon, il reste en brouillon)
        </label>

        {error && <p className="form-error">{error}</p>}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button className="btn btn--accent" disabled={saving}>
            {saving ? "Enregistrement…" : work ? "Enregistrer les modifications" : "Publier le récit"}
          </button>
          <button type="button" className="btn btn--ghost" onClick={() => router.push("/admin")}>
            Annuler
          </button>
          {work && (
            <DeleteButton
              url={`/api/admin/works/${work.id}`}
              redirectTo="/admin"
              confirmText={`Supprimer définitivement « ${work.title} » ?`}
              label="Supprimer le récit"
              className="btn btn--ghost danger"
            />
          )}
        </div>
      </div>

      <aside className="editor__side">
        <div className="editor__preview">
          <Cover title={shownTitle} cover={cover} />
        </div>
        <button type="button" className="btn btn--accent" onClick={inspire}>
          ✦ Créer la couverture d'après le texte
        </button>
        {note && <p className="suggest-note">{note}</p>}
        {!coverTouched && !note && (
          <p className="suggest-note">Si vous ne touchez à rien, la couverture sera composée d'après le texte à l'enregistrement.</p>
        )}

        <div className="field" style={{ marginBottom: 0 }}>
          <span className="field-label">Motif</span>
          <div className="motif-grid">
            {Object.entries(motifs).map(([key, m]) => (
              <button type="button" key={key} title={`${m.label} — ${m.hint}`} aria-pressed={cover.motif === key} onClick={() => update({ motif: key })}>
                <Cover title="" cover={{ ...cover, motif: key }} />
              </button>
            ))}
          </div>
          <small>{motifs[cover.motif]?.label}</small>
        </div>

        <div className="field" style={{ marginBottom: 0 }}>
          <span className="field-label">Palette</span>
          <div className="swatches">
            {Object.entries(palettes).map(([key, p]) => (
              <button
                type="button"
                key={key}
                title={p.label}
                aria-pressed={cover.palette === key}
                style={{ background: `linear-gradient(135deg, ${p.bg} 50%, ${p.a} 50%)` }}
                onClick={() => update({ palette: key })}
              />
            ))}
          </div>
        </div>

        <div className="field" style={{ marginBottom: 0 }}>
          <span className="field-label">Position du titre</span>
          <div className="seg">
            <button type="button" aria-pressed={cover.titlePos === "top"} onClick={() => update({ titlePos: "top" })}>
              En haut
            </button>
            <button type="button" aria-pressed={cover.titlePos === "bottom"} onClick={() => update({ titlePos: "bottom" })}>
              En bas
            </button>
          </div>
        </div>

        <button type="button" className="btn" onClick={() => update({ seed: Math.floor(Math.random() * 99999) })}>
          ↻ Nouvelle variation
        </button>
      </aside>
    </form>
  );
}
