import Link from "next/link";
import DeleteButton from "@/components/admin/DeleteButton";
import Cover from "@/components/Cover";
import { Sticker } from "@/components/Stickers";
import { getRecentComments, getWorks } from "@/lib/works";

export default async function AdminHome() {
  const [works, comments] = await Promise.all([getWorks({ all: true }), getRecentComments(40)]);
  const sum = (k: "views" | "likes" | "comments") => works.reduce((n, w) => n + w[k], 0);

  return (
    <>
      <div className="admin-title">
        <div>
          <h1>L'atelier de Rêve</h1>
          <p>Vos récits, vos lecteurs, leurs mots.</p>
        </div>
        <Link href="/admin/oeuvres/nouvelle" className="btn btn--accent">
          + Nouveau récit
        </Link>
      </div>

      <div className="stats">
        <div className="stat">
          <b>{works.length}</b>
          <span>Récits</span>
        </div>
        <div className="stat">
          <b>{sum("views")}</b>
          <span>Lectures</span>
        </div>
        <div className="stat">
          <b>{sum("likes")}</b>
          <span>J'aime</span>
        </div>
        <div className="stat">
          <b>{sum("comments")}</b>
          <span>Commentaires</span>
        </div>
      </div>

      <h2 className="panel-title" style={{ marginTop: 0 }}>
        Mes récits
      </h2>
      <div className="panel">
        {works.length === 0 && <p style={{ padding: "24px 0" }}>Aucun récit pour l'instant.</p>}
        {works.map((w) => (
          <div key={w.id} className="admin-work">
            <Cover title={w.cover_title} cover={w.cover} />
            <div>
              <h3>
                {w.title}
                <span className={`pill ${w.published ? "" : "pill--draft"}`}>{w.published ? "Publié" : "Brouillon"}</span>
              </h3>
              <p className="admin-work__meta">
                {w.views} lectures · {w.likes} j'aime · {w.comments} commentaires · ajouté le{" "}
                {new Date(w.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
            <div className="admin-work__actions">
              {w.published && (
                <Link href={`/oeuvres/${w.slug}`} target="_blank" className="btn btn--sm btn--ghost">
                  Lire
                </Link>
              )}
              <Link href={`/admin/oeuvres/${w.id}`} className="btn btn--sm">
                Modifier
              </Link>
              <DeleteButton
                url={`/api/admin/works/${w.id}`}
                confirmText={`Supprimer définitivement « ${w.title} » ainsi que ses j'aime et commentaires ?`}
              />
            </div>
          </div>
        ))}
      </div>

      <h2 className="panel-title">Derniers commentaires</h2>
      <div className="panel">
        {comments.length === 0 && <p style={{ padding: "24px 0", color: "var(--muted)" }}>Aucun commentaire pour l'instant.</p>}
        {comments.map((c) => (
          <div key={c.id} className="admin-comment">
            <div>
              <small>
                <b>{c.author}</b> {c.isReply ? "a répondu" : "a commenté"} sur{" "}
                <Link href={`/oeuvres/${c.workSlug}#avis`} target="_blank" style={{ textDecoration: "underline" }}>
                  {c.workTitle}
                </Link>{" "}
                · {new Date(c.createdAt).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}
              </small>
              <div className="admin-comment__body">
                {c.sticker && <Sticker name={c.sticker} size={36} />}
                {c.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={`/api/media/${c.image}`} alt="" />
                )}
                <span style={c.kind === "ecrit" ? { fontStyle: "italic" } : undefined}>
                  {c.body && (c.body.length > 220 ? `${c.body.slice(0, 220)}…` : c.body)}
                </span>
              </div>
            </div>
            <DeleteButton url={`/api/comments/${c.id}`} confirmText="Supprimer ce commentaire (et ses réponses) ?" />
          </div>
        ))}
      </div>
    </>
  );
}
