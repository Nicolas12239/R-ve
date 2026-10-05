"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import CommentsDrawer from "./CommentsDrawer";

type WorkCtx = {
  workId: number;
  liked: boolean;
  likes: number;
  pop: number;
  comments: number;
  toggleLike: () => void;
  openComments: () => void;
  share: () => void;
  toast: (msg: string) => void;
};

const Ctx = createContext<WorkCtx | null>(null);

export function useWork() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useWork doit être utilisé dans <WorkProvider>");
  return c;
}

export function WorkProvider({
  workId,
  title,
  initialLiked,
  initialLikes,
  initialComments,
  children,
}: {
  workId: number;
  title: string;
  initialLiked: boolean;
  initialLikes: number;
  initialComments: number;
  children: React.ReactNode;
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(initialLikes);
  const [pop, setPop] = useState(0);
  const [comments, setComments] = useState(initialComments);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const busy = useRef(false);

  const toast = useCallback((msg: string) => {
    setMessage(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(null), 2600);
  }, []);

  const toggleLike = useCallback(async () => {
    if (busy.current) return;
    busy.current = true;
    const next = !liked;
    setLiked(next);
    setLikes((n) => n + (next ? 1 : -1));
    if (next) setPop((p) => p + 1);
    try {
      const res = await fetch(`/api/works/${workId}/like`, { method: "POST" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setLiked(data.liked);
      setLikes(data.count);
    } catch {
      setLiked(!next);
      setLikes((n) => n + (next ? -1 : 1));
      toast("Le cœur n'a pas pu être envoyé. Réessayez.");
    } finally {
      busy.current = false;
    }
  }, [liked, workId, toast]);

  const share = useCallback(async () => {
    const url = window.location.href.split("#")[0];
    try {
      if (navigator.share) {
        await navigator.share({ title: `${title} — Rêve`, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast("Lien copié — offrez ce récit à quelqu'un.");
    } catch {
      /* partage annulé */
    }
  }, [title, toast]);

  const close = useCallback(() => setOpen(false), []);

  // Ouvre directement les commentaires si l'URL se termine par #avis
  useEffect(() => {
    if (window.location.hash === "#avis") setOpen(true);
  }, []);

  return (
    <Ctx.Provider
      value={{ workId, liked, likes, pop, comments, toggleLike, openComments: () => setOpen(true), share, toast }}
    >
      {children}
      {open && <CommentsDrawer workId={workId} onClose={close} onCount={setComments} toast={toast} />}
      {message && (
        <div className="toast" role="status">
          {message}
        </div>
      )}
    </Ctx.Provider>
  );
}
