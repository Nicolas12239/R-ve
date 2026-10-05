import Link from "next/link";
import Cover from "./Cover";
import { HeartIcon } from "./Icons";
import { readingMinutes } from "@/lib/works";
import type { Work } from "@/lib/types";

export default function BookCard({ work }: { work: Work }) {
  return (
    <article className="book-card" data-reveal>
      <Link href={`/oeuvres/${work.slug}`} className="book-card__cover" aria-label={`Lire « ${work.title} »`}>
        <Cover title={work.cover_title} cover={work.cover} />
        <span className="book-card__badge">
          <HeartIcon filled /> {work.likes}
        </span>
      </Link>
      <div>
        <h3>
          <Link href={`/oeuvres/${work.slug}`}>{work.title}</Link>
        </h3>
        <p className="book-card__meta">
          {readingMinutes(work.content)} min de lecture · {work.comments} avis
        </p>
        {work.excerpt && <p className="book-card__excerpt">« {work.excerpt} »</p>}
      </div>
    </article>
  );
}
