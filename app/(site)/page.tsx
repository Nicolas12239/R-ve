import Link from "next/link";
import BookCard from "@/components/BookCard";
import Cover from "@/components/Cover";
import { SparkleIcon } from "@/components/Icons";
import Quill from "@/components/Quill";
import Reveal from "@/components/Reveal";
import { getWorks } from "@/lib/works";

export const dynamic = "force-dynamic";

const TIMELINE = [
  { date: "v. 3300 av. J.-C.", text: "À Sumer, l'écriture cunéiforme naît dans l'argile fraîche." },
  { date: "v. 3200 av. J.-C.", text: "L'Égypte grave ses hiéroglyphes, les « paroles divines »." },
  { date: "v. 2100 av. J.-C.", text: "Gilgamesh pleure son ami : l'un des plus anciens poèmes du monde." },
  { date: "v. 1050 av. J.-C.", text: "Les Phéniciens réduisent le monde à vingt-deux lettres." },
  { date: "VIIIᵉ s. av. J.-C.", text: "Homère chante l'Iliade : la mémoire se transmet en vers." },
  { date: "v. 1450", text: "Gutenberg offre aux mots la liberté de l'imprimé." },
  { date: "Aujourd'hui", text: "Un écran, une âme, et vous qui lisez ces lignes." },
];

export default async function Home() {
  const works = await getWorks();
  const featured = works[0];

  return (
    <>
      <Reveal selector="[data-reveal]" />

      {/* ——— Héros ——— */}
      <section className="hero">
        <div className="hero__top">
          <div className="container hero__grid">
            <div />
            <div className="hero__copy">
              <span className="eyebrow">Amour · Âme · Silences</span>
              <h1>
                Des récits en vers,
                <br />
                écrits par <em>Rêve</em>
              </h1>
            </div>
          </div>
        </div>

        {featured && (
          <div className="hero__book-wrap">
            <Link href={`/oeuvres/${featured.slug}`} className="hero__book" aria-label={`Lire « ${featured.title} »`}>
              <Cover title={featured.cover_title} cover={featured.cover} priority />
            </Link>
          </div>
        )}

        <div className="hero__band">
          <div className="container hero__grid">
            <div />
            <div className="hero__cta">
              <p>Nouveau récit à découvrir</p>
              {featured?.excerpt && <blockquote>« {featured.excerpt} »</blockquote>}
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                {featured && (
                  <Link href={`/oeuvres/${featured.slug}`} className="btn btn--light">
                    Lire le récit
                  </Link>
                )}
                <Link href="/oeuvres" className="btn btn--light btn--ghost">
                  Toutes les œuvres →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ——— Mon amour pour l'écrit ——— */}
      <section className="story" id="mon-amour">
        <div className="story__visual" aria-hidden="true">
          <span className="story__initial">R</span>
          <Quill className="story__quill" />
          <div className="story__fragments">
            <span>Il ne souffre pas de jalousie.</span>
            <span>Il souffre d'être arrivé après.</span>
            <span>— Rêve</span>
          </div>
        </div>
        <div className="story__text" data-reveal>
          <h2>Mon amour pour l'écrit</h2>
          <hr className="rule" />
          <p>
            J'écris comme on se confie à la nuit. Longtemps, mes textes sont restés pliés au fond d'un tiroir, pareils
            à des lettres jamais envoyées — par pudeur, par doute, peut-être par peur d'être enfin lu. Mais l'écriture
            n'a jamais été pour moi un passe-temps : c'est le seul lieu où mon cœur accepte de déposer les armes.
          </p>
          <p>
            J'écris en vers parce que certaines vérités ne supportent pas d'être dites d'un seul souffle. Elles
            réclament un silence entre chaque ligne, comme on reprend sa respiration avant d'avouer. J'écris l'amour
            qui doute, l'amour qui s'abandonne, l'amour qui voit clair et choisit malgré tout ; j'écris ces guerres
            silencieuses que personne ne voit et qui, pourtant, nous façonnent.
          </p>
          <p>Si ces pages vous trouvent, c'est peut-être qu'elles vous attendaient.</p>
          <span className="story__sign">Rêve</span>
        </div>
      </section>

      {/* ——— Les œuvres ——— */}
      <section className="works" id="oeuvres">
        <div className="container">
          <div className="section-head" data-reveal>
            <h2>Récits à découvrir</h2>
            <hr className="rule rule--center" />
            <p>Pas d'inscription, pas de connexion. Seulement des mots, et la liberté d'y répondre.</p>
          </div>
          <div className="works__grid">
            {works.map((w) => (
              <BookCard key={w.id} work={w} />
            ))}
          </div>
          {works.length > 6 && (
            <div className="works__more">
              <Link href="/oeuvres" className="btn">
                Voir toutes les œuvres
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ——— Citation ——— */}
      <section className="quote-band">
        <div className="container" data-reveal>
          <blockquote>
            « Ce ne sont pas les premiers chapitres d'un livre qui en déterminent la beauté. C'est sa conclusion. »
          </blockquote>
          <cite>Rêve — Cette guerre silencieuse</cite>
        </div>
      </section>

      {/* ——— Histoire de l'écriture ——— */}
      <section className="history" id="histoire">
        <div className="container">
          <div className="section-head" data-reveal>
            <h2>Une brève histoire de l'écriture</h2>
            <hr className="rule rule--center" />
          </div>
          <div className="history__grid">
            <div className="history__text" data-reveal>
              <p>
                Bien avant les livres, il y eut la voix. Pendant des millénaires, les hommes confièrent leurs amours,
                leurs deuils et leurs prières à la seule mémoire, et c'est le rythme — déjà le vers — qui empêchait les
                mots de s'envoler. Puis, vers 3300 avant notre ère, à Sumer, des scribes pressèrent la pointe d'un
                roseau dans l'argile : l'écriture était née, d'abord pour compter les grains, très vite pour raconter
                Gilgamesh pleurant l'ami qu'il avait perdu.
              </p>
              <p>
                L'Égypte grava ses hiéroglyphes sur la pierre et le papyrus ; les Phéniciens réduisirent le monde à
                quelques signes, et cet alphabet voyagea jusqu'aux Grecs, aux Romains, puis jusqu'à nous. Homère chanta,
                les psalmistes prièrent, et le Cantique des Cantiques murmura que l'amour est fort comme la mort. Au
                Moyen Âge, des moines recopièrent chaque lettre à la lueur des chandelles, jusqu'à ce que Gutenberg, vers
                1450, rende aux mots leur liberté de voyager.
              </p>
              <p>
                Aujourd'hui, l'écriture tient dans la lumière d'un écran. Les supports ont changé ; le geste, lui, demeure
                le même : laisser une trace pour que quelqu'un, un jour, quelque part, se sente un peu moins seul.
              </p>
            </div>
            <ol className="timeline" data-reveal>
              {TIMELINE.map((t) => (
                <li key={t.date}>
                  <time>{t.date}</time>
                  <span>{t.text}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {featured && (
        <Link href="/hasard" className="float-cta">
          <SparkleIcon /> Un récit au hasard
        </Link>
      )}
    </>
  );
}
