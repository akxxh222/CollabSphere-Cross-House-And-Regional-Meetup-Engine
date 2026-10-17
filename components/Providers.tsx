"use client";

import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

// ─────────────────────────────────────────────
// Providers
// Wraps the entire app with NextAuth session and React Query contexts.
// Kept as a client component so the rest of the app can stay Server Components.
// ─────────────────────────────────────────────
export function Providers({ children }: { children: React.ReactNode }) {
  // Create QueryClient inside component to avoid shared state between SSR requests
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </SessionProvider>
  );
}
