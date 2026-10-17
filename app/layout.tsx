import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

// ─────────────────────────────────────────────
// Google Fonts (subset for performance)
// ─────────────────────────────────────────────
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

// ─────────────────────────────────────────────
// SEO Metadata
// ─────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: "CampusCare — IITM Hospital Visit Authorization",
    template: "%s | CampusCare",
  },
  description:
    "A secure digital platform for IITM students to request and track hospital visit authorizations, with real-time emergency escalation to proctors and parents.",
  keywords: ["IITM", "hospital", "authorization", "campus", "students", "proctor"],
  authors: [{ name: "CampusCare Team" }],
  robots: { index: false, follow: false }, // not a public-facing app
};

// ─────────────────────────────────────────────
// Root Layout
// ─────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${outfit.variable}`}
    >
      <body>
        {/* Skip to main content — accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 btn btn-primary"
        >
          Skip to main content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
