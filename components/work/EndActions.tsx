"use client";

import { CommentIcon, HeartIcon, ShareIcon } from "../Icons";
import { useWork } from "./WorkContext";

export default function EndActions() {
  const { liked, likes, pop, comments, toggleLike, openComments, share } = useWork();
  return (
    <div className="end-actions">
      <button className={`btn ${liked ? "btn--accent" : ""}`} onClick={toggleLike} aria-pressed={liked}>
        <HeartIcon key={pop} filled={liked} width={18} className={pop ? "heart-pop" : undefined} />
        {liked ? "Vous aimez ce récit" : "J'aime ce récit"} · {likes}
      </button>
      <button className="btn" onClick={openComments}>
        <CommentIcon width={18} /> Laisser un mot · {comments}
      </button>
      <button className="btn btn--ghost" onClick={share}>
        <ShareIcon width={18} /> Partager
      </button>
    </div>
  );
}
