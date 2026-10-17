import { PrismaClient } from "@prisma/client";

// ─────────────────────────────────────────────
// Prisma Client Singleton
//
// In development, Next.js hot-reloads modules which would create
// a new PrismaClient instance on every reload, exhausting the DB
// connection pool. We store the client on `globalThis` to reuse it.
// ─────────────────────────────────────────────

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
