import type { Metadata } from "next";
import BookCard from "@/components/BookCard";
import Reveal from "@/components/Reveal";
import { getWorks } from "@/lib/works";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Œuvres" };

export default async function WorksPage() {
  const works = await getWorks();
  return (
    <>
      <Reveal selector="[data-reveal]" />
      <section className="page-head">
        <div className="container">
          <span className="eyebrow">La bibliothèque de Rêve</span>
          <h1 style={{ marginTop: 18 }}>Toutes les œuvres</h1>
          <hr className="rule rule--center" />
          <p>
            {works.length} récit{works.length > 1 ? "s" : ""} en vers, à lire d'une traite ou à petites gorgées. Chaque
            couverture a été imaginée à partir de ce que le texte raconte.
          </p>
        </div>
      </section>
      <section className="works" style={{ paddingTop: 20 }}>
        <div className="container works__grid">
          {works.map((w) => (
            <BookCard key={w.id} work={w} />
          ))}
        </div>
      </section>
    </>
  );
}
