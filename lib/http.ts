import { NextResponse } from "next/server";
import { AppError, publicError } from "@/lib/errors";
export function apiError(error: unknown) { const result = publicError(error); return NextResponse.json({ error: result.error }, { status: result.status }); }
export function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const expected = new URL(process.env.NEXTAUTH_URL || request.url).origin;
  if (!origin || origin !== expected) throw new AppError("Invalid request origin", 403);
}
