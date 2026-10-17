import QRCode from "qrcode";
import { db } from "@/lib/db";
import { requireActor, requestScope } from "@/lib/access";
import { AppError } from "@/lib/errors";
import { apiError } from "@/lib/http";
export const dynamic = "force-dynamic";
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const actor = await requireActor();
    const request = await db.request.findFirst({
      where: { AND: [{ id: (await params).id }, requestScope(actor)] },
    });
    if (!request) throw new AppError("Request not found", 404);
    if (request.status !== "APPROVED" || !request.passToken)
      throw new AppError("A pass is available after approval", 409);
    const url = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/verify/${request.passToken}`;
    const png = await QRCode.toBuffer(url, {
      width: 360,
      margin: 2,
      errorCorrectionLevel: "M",
      color: { dark: "#102a25", light: "#ffffff" },
    });
    return new Response(new Uint8Array(png), {
      headers: { "Content-Type": "image/png", "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    return apiError(error);
  }
}
