"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.replace("/admin");
      router.refresh();
    } else {
      setError((await res.json().catch(() => ({}))).error ?? "Connexion impossible.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <Link href="/" className="brand" style={{ marginBottom: 40 }}>
        Rêve<span className="brand__dot" />
      </Link>
      <h1>Bon retour.</h1>
      <p>La plume vous attendait.</p>
      <div className="field">
        <label htmlFor="pw">Mot de passe</label>
        <input id="pw" className="input" type="password" autoFocus value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      {error && <p className="form-error">{error}</p>}
      <button className="btn btn--accent" style={{ width: "100%" }} disabled={busy}>
        {busy ? "Ouverture…" : "Entrer dans l'atelier"}
      </button>
    </form>
  );
}
