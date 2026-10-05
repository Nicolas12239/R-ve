"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BookIcon } from "./Icons";

const LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/#mon-amour", label: "À propos" },
  { href: "/oeuvres", label: "Œuvres" },
  { href: "/#histoire", label: "L'écriture" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : !href.includes("#") && pathname.startsWith(href);

  return (
    <header className={`site-header ${open ? "menu-open" : ""}`}>
      <div className="container site-header__inner">
        <Link href="/" className="brand" aria-label="Rêve — accueil">
          Rêve<span className="brand__dot" />
        </Link>
        <nav className="nav" aria-label="Navigation principale">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} aria-current={isActive(l.href) ? "page" : undefined} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
        </nav>
        <Link href="/hasard" className="header-cta">
          <BookIcon /> Un récit au hasard
        </Link>
        <button className="menu-toggle" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
