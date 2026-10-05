import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Libre_Baskerville, Playfair_Display } from "next/font/google";
import "./globals.css";

const display = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-display",
});
const body = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-body",
});
const verse = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-verse",
});

export const metadata: Metadata = {
  title: { default: "Rêve — Récits en vers", template: "%s · Rêve" },
  description:
    "Rêve écrit en vers sur l'amour, la psychologie et les guerres silencieuses du cœur. Lisez, aimez, laissez un mot.",
};

export const viewport: Viewport = { themeColor: "#ffffff" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${display.variable} ${body.variable} ${verse.variable}`}>
      <body>{children}</body>
    </html>
  );
}
