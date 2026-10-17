import "server-only";
import { Prisma } from "@prisma/client";
import { Actor, requestScope } from "@/lib/access";
import { db } from "@/lib/db";

export const requestInclude = { student: { select: { id: true, name: true, registerNo: true, department: true } }, proctor: { select: { id: true, name: true } }, auditLogs: { include: { user: { select: { name: true } } }, orderBy: { createdAt: "asc" as const } } } satisfies Prisma.RequestInclude;
export type RequestRecord = Prisma.RequestGetPayload<{ include: typeof requestInclude }>;
export type RequestView = Omit<RequestRecord, "createdAt" | "updatedAt" | "visitDate" | "returnDate" | "approvedAt" | "rejectedAt" | "escalatedAt" | "auditLogs"> & { createdAt: string; updatedAt: string; visitDate: string; returnDate: string | null; approvedAt: string | null; rejectedAt: string | null; escalatedAt: string | null; auditLogs: (Omit<RequestRecord["auditLogs"][number], "createdAt"> & { createdAt: string })[] };
export function serializeRequest(request: RequestRecord): RequestView { return JSON.parse(JSON.stringify(request)); }

export function filterWhere(params: URLSearchParams): Prisma.RequestWhereInput {
  const status = params.get("status");
  const q = params.get("q")?.slice(0, 100);
  const from = params.get("from"), to = params.get("to");
  const range: { gte?: Date; lte?: Date } = {};
  if (from && !isNaN(Date.parse(from))) range.gte = new Date(`${from.slice(0,10)}T00:00:00+05:30`);
  if (to && !isNaN(Date.parse(to))) range.lte = new Date(`${to.slice(0,10)}T23:59:59.999+05:30`);
  return {
    ...(status && ["PENDING", "APPROVED", "REJECTED", "ESCALATED"].includes(status) ? { status: status as "PENDING" } : {}),
    ...(q ? { OR: [{ hospitalName: { contains: q, mode: "insensitive" } }, { student: { name: { contains: q, mode: "insensitive" } } }, { student: { registerNo: { contains: q, mode: "insensitive" } } }, { proctor: { name: { contains: q, mode: "insensitive" } } }] } : {}),
    ...(Object.keys(range).length ? { createdAt: range } : {}),
  };
}
export async function listRequests(actor: Actor, params = new URLSearchParams()) {
  const page = Math.max(1, Math.min(10000, Number(params.get("page")) || 1));
  const where = { AND: [requestScope(actor), filterWhere(params)] };
  const sort = params.get("sort") ?? "createdAt";
  const direction = params.get("direction") === "asc" ? "asc" : "desc";
  const orderBy: Prisma.RequestOrderByWithRelationInput = sort === "student" ? { student: { name: direction } } : sort === "hospitalName" ? { hospitalName: direction } : sort === "status" ? { status: direction } : sort === "visitDate" ? { visitDate: direction } : { createdAt: direction };
  const [rows, total] = await Promise.all([db.request.findMany({ where, include: requestInclude, orderBy: [orderBy, { id: "asc" }], take: 10, skip: (page - 1) * 10 }), db.request.count({ where })]);
  return { rows: rows.map(serializeRequest), total, page, pages: Math.max(1, Math.ceil(total / 10)) };
}
export async function getStats(actor: Actor) {
  const where = requestScope(actor);
  const [groups, emergencies, resolved, weekly] = await Promise.all([
    db.request.groupBy({ by: ["status"], where, _count: true }),
    db.request.count({ where: { AND: [where, { isEmergency: true, status: { in: ["PENDING", "ESCALATED"] } }] } }),
    db.request.findMany({ where: { AND: [where, { status: { in: ["APPROVED", "REJECTED"] } }] }, select: { createdAt: true, approvedAt: true, rejectedAt: true } }),
    db.request.findMany({ where: { AND: [where, { createdAt: { gte: new Date(Date.now() - 7 * 86400000) } }] }, select: { createdAt: true, status: true } }),
  ]);
  const counts = Object.fromEntries(groups.map(g => [g.status, g._count]));
  const total = groups.reduce((sum, g) => sum + g._count, 0);
  const times = resolved.map(r => (r.approvedAt ?? r.rejectedAt)!.getTime() - r.createdAt.getTime());
  const trend = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(Date.now() - (6 - i) * 86400000);
    const key = date.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
    const rows = weekly.filter(r => r.createdAt.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }) === key);
    return { day: date.toLocaleDateString("en-IN", { weekday: "short", timeZone: "Asia/Kolkata" }), requests: rows.length, approved: rows.filter(r => r.status === "APPROVED").length, rejected: rows.filter(r => r.status === "REJECTED").length };
  });
  return { total, pending: counts.PENDING ?? 0, approved: counts.APPROVED ?? 0, escalated: counts.ESCALATED ?? 0, approvalRate: total ? Math.round((counts.APPROVED ?? 0) / total * 100) : 0, avgMinutes: times.length ? Math.round(times.reduce((a,b) => a+b, 0) / times.length / 60000) : null, emergencies, trend };
}
