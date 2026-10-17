import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Page Not Found" };

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="min-h-screen flex items-center justify-center p-6 text-center"
    >
      <div className="animate-in">
        <div className="text-7xl mb-6" aria-hidden="true">
          🏥
        </div>
        <h1 className="text-4xl font-bold mb-3">404</h1>
        <p className="text-lg mb-2" style={{ color: "var(--text-primary)" }}>
          Page not found
        </p>
        <p className="mb-8" style={{ color: "var(--text-secondary)" }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/" className="btn btn-primary" aria-label="Go back to home page">
          Go home
        </Link>
      </div>
    </main>
  );
}
