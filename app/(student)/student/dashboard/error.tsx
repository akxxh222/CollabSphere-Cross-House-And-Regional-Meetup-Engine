"use client";

export default function StudentDashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[400px] text-center animate-in">
      <div className="text-4xl mb-4" aria-hidden="true">⚠️</div>
      <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
      <p style={{ color: "var(--text-secondary)" }} className="mb-6 max-w-sm">
        {error.message || "An unexpected error occurred loading your dashboard."}
      </p>
      <button
        id="student-dashboard-retry"
        onClick={reset}
        className="btn btn-primary"
        aria-label="Retry loading the dashboard"
      >
        Try again
      </button>
    </div>
  );
}
