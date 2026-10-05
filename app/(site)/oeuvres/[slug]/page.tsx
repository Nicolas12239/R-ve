import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BookCard from "@/components/BookCard";
import Cover from "@/components/Cover";
import { ArrowDownIcon, ClockIcon, CommentIcon, EyeIcon, HeartIcon } from "@/components/Icons";
import Reveal from "@/components/Reveal";
import EndActions from "@/components/work/EndActions";
import Reader from "@/components/work/Reader";
import { WorkProvider } from "@/components/work/WorkContext";
import { palettes } from "@/lib/covers";
import { readVisitor } from "@/lib/visitor";
import { getWorkBySlug, getWorks, hasLiked, incrementViews, readingMinutes, toVerses } from "@/lib/works";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const work = await getWorkBySlug((await params).slug);
  if (!work) return { title: "Récit introuvable" };
  return { title: work.title, description: work.excerpt ?? undefined };
}

function verseClass(v: string) {
  if (v.startsWith("«")) return "verse verse--quote";
  if (v.endsWith("…") && v.length < 40) return "verse verse--breath";
  if (v.length < 34) return "verse verse--short";
  return "verse";
}

export default async function WorkPage({ params }: Props) {
  const work = await getWorkBySlug((await params).slug);
  if (!work) notFound();

  const visitor = await readVisitor();
  const [liked, others] = await Promise.all([hasLiked(work.id, visitor), getWorks(), incrementViews(work.id)]);
  const verses = toVerses(work.content);
  const minutes = readingMinutes(work.content);
  const bg = (palettes[work.cover.palette] ?? palettes.rose).bg;
  const isDarkCover = !!palettes[work.cover.palette]?.dark;

  return (
    <WorkProvider workId={work.id} title={work.title} initialLiked={liked} initialLikes={work.likes} initialComments={work.comments}>
      <Reveal />
      <section
        className="read-hero"
        style={{ ["--read-bg" as string]: isDarkCover ? "#ece6ef" : bg }}
      >
        <div className="container read-hero__grid">
          <div className="read-hero__cover">
            <Cover title={work.cover_title} cover={work.cover} priority />
          </div>
          <div className="read-hero__info">
            {work.theme && <span className="eyebrow">{work.theme}</span>}
            <h1>{work.title}</h1>
            {work.subtitle && <p className="read-hero__subtitle">{work.subtitle}</p>}
            <div className="read-hero__meta">
              <span>
                <ClockIcon /> {minutes} min de lecture
              </span>
              <span>
                <EyeIcon /> {work.views + 1} lecture{work.views ? "s" : ""}
              </span>
              <span>
                <HeartIcon /> {work.likes} j'aime
              </span>
              <span>
                <CommentIcon /> {work.comments} avis
              </span>
            </div>
            <a href="#lecture" className="btn">
              Commencer la lecture <ArrowDownIcon width={16} />
            </a>
          </div>
        </div>
      </section>

      <Reader>
        <div className="reader__column">
          {work.epigraphs.length > 0 && (
            <div className="epigraphs">
              {work.epigraphs.map((e, i) => (
                <blockquote key={i} className="epigraph">
                  « {e.text} »{e.source && <cite>{e.source}</cite>}
                </blockquote>
              ))}
            </div>
          )}
          <div className="ornament">✦</div>
          <div className="verses">
            {verses.map((v, i) => (
              <p key={i} className={verseClass(v)}>
                {v}
              </p>
            ))}
          </div>
          <div className="reader__end">
            <div className="ornament" style={{ marginBottom: 30 }}>
              ✦
            </div>
            <div className="fin">Fin</div>
            <p>Si ces mots ont trouvé un écho en vous, dites-le. Rêve lit chaque message.</p>
            <EndActions />
          </div>
        </div>
      </Reader>

      {others.length > 1 && (
        <section className="more-works">
          <div className="container">
            <div className="section-head">
              <h2>D'autres récits de Rêve</h2>
              <hr className="rule rule--center" />
            </div>
            <div className="works__grid">
              {others
                .filter((w) => w.id !== work.id)
                .slice(0, 3)
                .map((w) => (
                  <BookCard key={w.id} work={w} />
                ))}
            </div>
            <div className="works__more">
              <Link href="/oeuvres" className="btn">
                Toute la bibliothèque
              </Link>
            </div>
          </div>
        </section>
      )}
    </WorkProvider>
  );
}
