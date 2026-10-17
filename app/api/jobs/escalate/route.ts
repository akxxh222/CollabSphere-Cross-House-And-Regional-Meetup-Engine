import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { runEscalationJob } from "@/lib/services/requests";
import { apiError } from "@/lib/http";
export const dynamic = "force-dynamic";
export const maxDuration = 60;
export async function GET(request: Request) {
  const expected = process.env.CRON_SECRET;
  const received = request.headers.get("authorization") ?? "";
  const value = `Bearer ${expected}`;
  if (!expected || received.length !== value.length || !timingSafeEqual(Buffer.from(received), Buffer.from(value))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try { return NextResponse.json(await runEscalationJob()); } catch (error) { return apiError(error); }
}
