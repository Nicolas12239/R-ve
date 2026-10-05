import type { Metadata } from "next";
import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import Cover from "@/components/Cover";
import { isAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Espace auteur", robots: { index: false } };

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <div className="login">
      <div className="login__art">
        <Cover title="Espace auteur" cover={{ motif: "refuge", palette: "rose", seed: 42, titlePos: "bottom" }} />
      </div>
      <div className="login__form">
        <LoginForm />
      </div>
    </div>
  );
}
