import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/admin/LogoutButton";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Espace auteur", robots: { index: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin())) redirect("/admin/connexion");
  return (
    <div className="admin">
      <header className="admin-bar">
        <div className="container admin-bar__inner">
          <Link href="/admin" className="brand">
            Rêve<span className="brand__dot" />
          </Link>
          <span className="admin-bar__label">Atelier</span>
          <Link href="/" target="_blank">
            Voir le site ↗
          </Link>
          <LogoutButton />
        </div>
      </header>
      <main className="admin-main">
        <div className="container">{children}</div>
      </main>
    </div>
  );
}
