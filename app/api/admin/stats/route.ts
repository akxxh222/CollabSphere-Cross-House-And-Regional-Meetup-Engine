import { NextResponse } from "next/server";
import { requireActor } from "@/lib/access";
import { getStats } from "@/lib/queries";
import { apiError } from "@/lib/http";
export const dynamic = "force-dynamic";
export async function GET() { try { return NextResponse.json(await getStats(await requireActor(["ADMIN"]))); } catch (error) { return apiError(error); } }
