import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page-head" style={{ minHeight: "80vh", display: "grid", placeContent: "center" }}>
      <span className="eyebrow">Page introuvable</span>
      <h1 style={{ marginTop: 18 }}>Ce vers s'est égaré.</h1>
      <hr className="rule rule--center" />
      <p>Certaines pages, comme certains souvenirs, ne se laissent pas retrouver.</p>
      <div style={{ marginTop: 36 }}>
        <Link href="/" className="btn">
          Revenir à l'accueil
        </Link>
      </div>
    </main>
  );
}
