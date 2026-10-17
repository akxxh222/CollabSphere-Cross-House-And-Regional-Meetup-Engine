"use client";
import { AlertTriangle } from "lucide-react";
export function RouteError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="card empty-state">
      <AlertTriangle className="mx-auto mb-5 accent" size={32} />
      <h2>We couldn’t load this page.</h2>
      <p className="muted text-xs mt-3 mb-6">
        Please try again. If it continues, contact your campus administrator.
      </p>
      <button className="btn btn-primary" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
