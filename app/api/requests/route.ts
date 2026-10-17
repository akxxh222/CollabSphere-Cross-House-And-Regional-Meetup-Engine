import { NextResponse } from "next/server";
import { requireActor } from "@/lib/access";
import { listRequests } from "@/lib/queries";
import { createRequest } from "@/lib/services/requests";
import { apiError, assertSameOrigin } from "@/lib/http";
export const dynamic = "force-dynamic";
export async function GET(request: Request) { try { return NextResponse.json(await listRequests(await requireActor(), new URL(request.url).searchParams)); } catch (error) { return apiError(error); } }
export async function POST(request: Request) { try { assertSameOrigin(request); const result = await createRequest(await requireActor(["STUDENT"]), await request.json()); return NextResponse.json({ id: result.id }, { status: 201 }); } catch (error) { return apiError(error); } }
