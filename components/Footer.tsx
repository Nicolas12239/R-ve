import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__grid">
          <div>
            <Link href="/" className="brand">
              Rêve<span className="brand__dot" />
            </Link>
            <p>Des récits en vers sur l'amour, l'âme et ses silences. Ici, on ne s'inscrit pas : on lit, on ressent, on répond.</p>
          </div>
          <nav aria-label="Pied de page">
            <Link href="/">Accueil</Link>
            <Link href="/oeuvres">Œuvres</Link>
            <Link href="/#histoire">L'écriture</Link>
          </nav>
        </div>
        <div className="site-footer__legal">
          <span>© {new Date().getFullYear()} Rêve — Tous les textes sont la propriété de leur auteur.</span>
          <Link href="/admin">Espace auteur</Link>
        </div>
      </div>
    </footer>
  );
}
