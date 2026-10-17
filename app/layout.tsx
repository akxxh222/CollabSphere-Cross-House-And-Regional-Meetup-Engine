import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

// ─────────────────────────────────────────────
// Google Fonts (subset for performance)
// ─────────────────────────────────────────────

// ─────────────────────────────────────────────
// SEO Metadata
// ─────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: "CollabSphere — IIT Madras",
    template: "%s | CollabSphere",
  },
  description:
    "Regional meetups, joint house events, and verified participation for the IIT Madras online degree community.",
  keywords: ["IIT Madras", "online degree", "meetups", "regional community", "students"],
  authors: [{ name: "CollabSphere Team" }],
  robots: { index: true, follow: true },
};

// ─────────────────────────────────────────────
// Root Layout
// ─────────────────────────────────────────────
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
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
