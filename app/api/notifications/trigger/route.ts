import { NextResponse } from "next/server";
import { requireActor } from "@/lib/access";
import { dispatchNotifications } from "@/lib/services/notifications";
import { apiError, assertSameOrigin } from "@/lib/http";
export async function POST(request: Request) { try { assertSameOrigin(request); await requireActor(["ADMIN"]); return NextResponse.json({ processed: await dispatchNotifications() }); } catch (error) { return apiError(error); } }
