import type { RequestStatus } from "@prisma/client";
export const statusMap = {
  APPROVE: "APPROVED",
  REJECT: "REJECTED",
  ESCALATE: "ESCALATED",
} as const;
export function canTransition(current: RequestStatus, next: RequestStatus) {
  return (
    (current === "PENDING" && ["APPROVED", "REJECTED", "ESCALATED"].includes(next)) ||
    (current === "ESCALATED" && ["APPROVED", "REJECTED"].includes(next))
  );
}
export function isEscalationDue(
  request: { status: RequestStatus; isEmergency: boolean; createdAt: Date },
  timeout: number,
  now = Date.now(),
) {
  return (
    request.status === "PENDING" &&
    request.isEmergency &&
    now - request.createdAt.getTime() >= timeout
  );
}
export function csvCell(value: unknown) {
  const text = String(value ?? "");
  const safe = /^[=+@\-\t\r]/.test(text) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
}
export function renderTemplate(template: string, data: Record<string, string>) {
  return template.replace(/\{(student|hospital|status)\}/g, (_, key: string) => data[key] ?? "");
}
