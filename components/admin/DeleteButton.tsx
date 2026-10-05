"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** Bouton de suppression avec confirmation (œuvre ou commentaire). */
export default function DeleteButton({
  url,
  confirmText,
  label = "Supprimer",
  redirectTo,
  className = "btn btn--sm btn--ghost danger",
}: {
  url: string;
  confirmText: string;
  label?: string;
  redirectTo?: string;
  className?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      className={className}
      disabled={busy}
      onClick={async () => {
        if (!confirm(confirmText)) return;
        setBusy(true);
        const res = await fetch(url, { method: "DELETE" });
        setBusy(false);
        if (!res.ok) return alert("La suppression a échoué.");
        if (redirectTo) router.push(redirectTo);
        router.refresh();
      }}
    >
      {busy ? "…" : label}
    </button>
  );
}
