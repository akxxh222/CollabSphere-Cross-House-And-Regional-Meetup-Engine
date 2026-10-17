"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <main
          id="main-content"
          className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
          style={{ background: "var(--bg-secondary)", color: "var(--text-primary)" }}
        >
          <div className="text-5xl mb-4" aria-hidden="true">⚠️</div>
          <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
          <p className="mb-6 max-w-sm" style={{ color: "var(--text-secondary)" }}>
            {error.message || "A critical error occurred. Please try again."}
          </p>
          <button
            id="global-error-retry"
            onClick={reset}
            aria-label="Retry the application"
            style={{
              padding: "0.625rem 1.5rem",
              borderRadius: "0.625rem",
              background: "hsl(220,80%,52%)",
              color: "white",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
