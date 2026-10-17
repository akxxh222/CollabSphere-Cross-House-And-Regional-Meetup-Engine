import { NextResponse } from "next/server";
import { requireActor } from "@/lib/access";
import { changeRequest } from "@/lib/services/requests";
import { apiError, assertSameOrigin } from "@/lib/http";
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    assertSameOrigin(request);
    return NextResponse.json(
      await changeRequest(await requireActor(["PROCTOR", "ADMIN"]), {
        ...(await request.json()),
        requestId: (await params).id,
      }),
    );
  } catch (error) {
    return apiError(error);
  }
}
