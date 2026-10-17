import { db } from "@/lib/db";
import { requireActor, requestScope } from "@/lib/access";
import { filterWhere } from "@/lib/queries";
import { csvCell } from "@/lib/domain";
import { apiError } from "@/lib/http";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  try {
    const actor = await requireActor(["ADMIN", "PROCTOR"]);
    const rows = await db.request.findMany({
      where: { AND: [requestScope(actor), filterWhere(new URL(request.url).searchParams)] },
      include: { student: true, proctor: true },
      orderBy: { createdAt: "desc" },
      take: 10000,
    });
    const data = [
      [
        "Request ID",
        "Student",
        "Register number",
        "Hospital",
        "Status",
        "Emergency",
        "Visit date",
        "Created at",
        "Proctor",
      ],
      ...rows.map((r) => [
        r.id,
        r.student.name,
        r.student.registerNo,
        r.hospitalName,
        r.status,
        r.isEmergency,
        r.visitDate.toISOString(),
        r.createdAt.toISOString(),
        r.proctor?.name,
      ]),
    ]
      .map((row) => row.map(csvCell).join(","))
      .join("\r\n");
    return new Response("\uFEFF" + data, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="campuscare-requests.csv"',
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    return apiError(error);
  }
}
