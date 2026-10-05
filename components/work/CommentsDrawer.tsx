"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CommentItem } from "@/lib/types";
import { CloseIcon, HeartIcon, ImageIcon, QuillIcon, SendIcon, StickerIcon } from "../Icons";
import { STICKERS, Sticker } from "../Stickers";

const AVATAR_COLORS = ["#e8473f", "#2a7a62", "#5a4a8c", "#c4473f", "#3a5e80", "#b0573a", "#c85f7c", "#1c1c1c"];

function avatarColor(name: string) {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

function timeAgo(iso: string) {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "à l'instant";
  if (s < 3600) return `il y a ${Math.floor(s / 60)} min`;
  if (s < 86400) return `il y a ${Math.floor(s / 3600)} h`;
  if (s < 86400 * 7) return `il y a ${Math.floor(s / 86400)} j`;
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

const countAll = (list: CommentItem[]) => list.reduce((n, c) => n + 1 + (c.replies?.length ?? 0), 0);

type Props = {
  workId: number;
  onClose: () => void;
  onCount: (n: number) => void;
  toast: (msg: string) => void;
};

export default function CommentsDrawer({ workId, onClose, onCount, toast }: Props) {
  const [comments, setComments] = useState<CommentItem[] | null>(null);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [replyTo, setReplyTo] = useState<{ id: number; author: string; rootId: number } | null>(null);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [kind, setKind] = useState<"texte" | "ecrit">("texte");
  const [sticker, setSticker] = useState<string | null>(null);
  const [image, setImage] = useState<{ file: string | null; preview: string } | null>(null);
  const [stickers, setStickers] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/works/${workId}/comments`, { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setComments(data.comments);
      onCount(countAll(data.comments));
    } catch {
      /* hors ligne : on garde l'état courant */
    }
  }, [workId, onCount]);

  // Chargement, rafraîchissement régulier pour converser, fermeture par Échap
  useEffect(() => {
    load();
    const t = setInterval(() => document.visibilityState === "visible" && load(), 12000);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && (lightbox ? setLightbox(null) : onClose());
    window.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      clearInterval(t);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [load, onClose, lightbox]);

  useEffect(() => {
    try {
      setName(localStorage.getItem("reve_name") ?? "");
    } catch {
      /* stockage indisponible */
    }
  }, []);

  const autosize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, kind === "ecrit" ? 220 : 140)}px`;
  };

  const patch = (id: number, fn: (c: CommentItem) => CommentItem) =>
    setComments((list) =>
      list?.map((c) => (c.id === id ? fn(c) : { ...c, replies: c.replies?.map((r) => (r.id === id ? fn(r) : r)) })) ?? null
    );

  async function likeComment(c: CommentItem) {
    const next = !c.liked;
    patch(c.id, (x) => ({ ...x, liked: next, likes: x.likes + (next ? 1 : -1) }));
    try {
      const res = await fetch(`/api/comments/${c.id}/like`, { method: "POST" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      patch(c.id, (x) => ({ ...x, liked: data.liked, likes: data.count }));
    } catch {
      patch(c.id, (x) => ({ ...x, liked: !next, likes: x.likes + (next ? -1 : 1) }));
    }
  }

  async function remove(c: CommentItem) {
    if (!confirm("Supprimer ce commentaire ?")) return;
    const res = await fetch(`/api/comments/${c.id}`, { method: "DELETE" });
    if (res.ok) {
      toast("Commentaire supprimé.");
      load();
    }
  }

  function startReply(c: CommentItem, rootId: number) {
    setReplyTo({ id: c.id, author: c.author, rootId });
    setExpanded((s) => new Set(s).add(rootId));
    inputRef.current?.focus();
  }

  async function pickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 6 * 1024 * 1024) return setError("Image trop lourde (6 Mo maximum).");
    setError(null);
    const preview = URL.createObjectURL(file);
    setImage({ file: null, preview });
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setImage({ file: data.file, preview });
    } catch (err) {
      setImage(null);
      setError(err instanceof Error && err.message ? err.message : "L'image n'a pas pu être envoyée.");
    }
  }

  const uploading = !!image && !image.file;
  const canSend = !sending && !uploading && (!!text.trim() || !!sticker || !!image?.file);

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!canSend) return;
    setSending(true);
    setError(null);
    const author = name.trim();
    try {
      if (author) localStorage.setItem("reve_name", author);
    } catch {
      /* stockage indisponible */
    }
    try {
      const res = await fetch(`/api/works/${workId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author,
          kind,
          body: text,
          sticker,
          image: image?.file ?? null,
          parentId: replyTo?.id ?? null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setText("");
      setSticker(null);
      setImage(null);
      setStickers(false);
      setKind("texte");
      if (inputRef.current) inputRef.current.style.height = "auto";
      const wasReply = !!replyTo;
      setReplyTo(null);
      await load();
      if (!wasReply) listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : "Votre mot n'a pas pu être envoyé.");
    } finally {
      setSending(false);
    }
  }

  const renderComment = (c: CommentItem, rootId: number, isReply = false) => (
    <div key={c.id} className={`comment ${isReply ? "comment--reply" : ""}`}>
      <span className="avatar" style={{ background: avatarColor(c.author) }} aria-hidden="true">
        {c.author.charAt(0).toUpperCase()}
      </span>
      <div>
        <div className="comment__author">
          <b>{c.author}</b>
          {c.replyTo && <span className="to"> ▸ {c.replyTo}</span>}
          {c.mine && " · vous"}
        </div>
        {c.body &&
          (c.kind === "ecrit" ? (
            <div className="comment__ecrit">
              <small>✒ Écrit partagé</small>
              {c.body}
            </div>
          ) : (
            <p className="comment__body">{c.body}</p>
          ))}
        {c.sticker && (
          <div className="comment__sticker">
            <Sticker name={c.sticker} size={84} />
          </div>
        )}
        {c.image && (
          <button className="comment__image" onClick={() => setLightbox(`/api/media/${c.image}`)} aria-label="Agrandir la photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/api/media/${c.image}`} alt="Photo partagée" loading="lazy" />
          </button>
        )}
        <div className="comment__foot">
          <span>{timeAgo(c.createdAt)}</span>
          <button onClick={() => startReply(c, rootId)}>Répondre</button>
          {c.mine && <button onClick={() => remove(c)}>Supprimer</button>}
        </div>
      </div>
      <button className={`comment__like ${c.liked ? "is-liked" : ""}`} onClick={() => likeComment(c)} aria-pressed={c.liked} aria-label="J'aime ce commentaire">
        <HeartIcon filled={c.liked} />
        {c.likes > 0 && c.likes}
      </button>
    </div>
  );

  const total = comments ? countAll(comments) : 0;

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <section className="drawer" role="dialog" aria-modal="true" aria-label="Commentaires">
        <header className="drawer__head">
          <h2>
            {comments === null ? "Commentaires" : `${total} commentaire${total > 1 ? "s" : ""}`}
          </h2>
          <p>Sans inscription — juste votre nom de plume</p>
          <button className="icon-btn drawer__close" onClick={onClose} aria-label="Fermer">
            <CloseIcon />
          </button>
        </header>

        <div className="drawer__list" ref={listRef}>
          {comments === null && <div className="drawer__empty">Les mots arrivent…</div>}
          {comments?.length === 0 && (
            <div className="drawer__empty">
              <Sticker name="plume" size={72} />
              Soyez la première âme à laisser un mot.
            </div>
          )}
          {comments?.map((c) => {
            const replies = c.replies ?? [];
            const open = expanded.has(c.id);
            return (
              <div key={c.id}>
                {renderComment(c, c.id)}
                {replies.length > 0 && open && <div className="replies">{replies.map((r) => renderComment(r, c.id, true))}</div>}
                {replies.length > 0 && (
                  <button
                    className="replies-toggle"
                    onClick={() =>
                      setExpanded((s) => {
                        const n = new Set(s);
                        if (open) n.delete(c.id);
                        else n.add(c.id);
                        return n;
                      })
                    }
                  >
                    {open ? "Masquer" : `Voir ${replies.length} réponse${replies.length > 1 ? "s" : ""}`}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <form className={`composer ${kind === "ecrit" ? "composer--ecrit" : ""}`} onSubmit={submit}>
          {replyTo && (
            <div className="composer__replying">
              <span>
                Réponse à <b>{replyTo.author}</b>
              </span>
              <button type="button" onClick={() => setReplyTo(null)} aria-label="Annuler la réponse">
                ✕
              </button>
            </div>
          )}
          <label className="composer__name">
            Signé
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Votre nom de plume" maxLength={40} />
          </label>

          {(sticker || image) && (
            <div className="composer__attachments">
              {sticker && (
                <div className="attachment">
                  <Sticker name={sticker} size={64} />
                  <button type="button" onClick={() => setSticker(null)} aria-label="Retirer le sticker">
                    ✕
                  </button>
                </div>
              )}
              {image && (
                <div className={`attachment ${uploading ? "attachment--loading" : ""}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image.preview} alt="" style={{ opacity: uploading ? 0.4 : 1 }} />
                  {!uploading && (
                    <button type="button" onClick={() => setImage(null)} aria-label="Retirer la photo">
                      ✕
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {stickers && (
            <div className="sticker-panel">
              {Object.entries(STICKERS).map(([key, s]) => (
                <button
                  type="button"
                  key={key}
                  title={s.label}
                  onClick={() => {
                    setSticker(key);
                    setStickers(false);
                  }}
                >
                  <Sticker name={key} size={46} />
                </button>
              ))}
            </div>
          )}

          <div className="composer__box">
            <textarea
              ref={inputRef}
              rows={1}
              value={text}
              maxLength={kind === "ecrit" ? 4000 : 1500}
              placeholder={
                kind === "ecrit"
                  ? "Partagez quelques vers, une pensée, un écrit…"
                  : replyTo
                    ? `Répondre à ${replyTo.author}…`
                    : "Ajouter un commentaire…"
              }
              onChange={(e) => {
                setText(e.target.value);
                autosize(e.target);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && kind === "texte") {
                  e.preventDefault();
                  submit();
                }
              }}
            />
            <div className="composer__tools">
              <button
                type="button"
                className={`icon-btn ${kind === "ecrit" ? "is-active" : ""}`}
                onClick={() => setKind((k) => (k === "ecrit" ? "texte" : "ecrit"))}
                title="Partager un écrit"
                aria-pressed={kind === "ecrit"}
              >
                <QuillIcon />
              </button>
              <button
                type="button"
                className={`icon-btn ${stickers ? "is-active" : ""}`}
                onClick={() => setStickers((s) => !s)}
                title="Stickers"
                aria-expanded={stickers}
              >
                <StickerIcon />
              </button>
              <button type="button" className="icon-btn" onClick={() => fileRef.current?.click()} title="Ajouter une photo">
                <ImageIcon />
              </button>
              <button type="submit" className="send-btn" disabled={!canSend} aria-label="Publier">
                <SendIcon />
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" hidden onChange={pickImage} />
          </div>
          {error && <p className="composer__error">{error}</p>}
        </form>
      </section>

      {lightbox && (
        <button className="lightbox" onClick={() => setLightbox(null)} aria-label="Fermer la photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightbox} alt="Photo partagée" />
        </button>
      )}
    </>
  );
}
