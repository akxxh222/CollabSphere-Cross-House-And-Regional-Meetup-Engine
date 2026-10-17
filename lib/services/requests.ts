import "server-only";
import { randomBytes } from "crypto";
import { db } from "@/lib/db";
import { Actor, requestScope } from "@/lib/access";
import { AppError } from "@/lib/errors";
import { submitRequestSchema, reviewRequestSchema } from "@/lib/validations";
import { canTransition, statusMap } from "@/lib/domain";
import { queueNotifications, dispatchNotifications } from "./notifications";

export async function createRequest(actor: Actor, input: unknown) {
  if (actor.role !== "STUDENT") throw new AppError("Only students can submit requests", 403);
  const data = submitRequestSchema.parse(input);
  return db.$transaction(async tx => {
    const student = await tx.user.findUniqueOrThrow({ where: { id: actor.id }, include: { assignedProctor: true, parent: true } });
    if (!student.assignedProctor?.isActive) throw new AppError("Ask an administrator to assign an active proctor first");
    if (data.isEmergency && (!student.parent?.isActive || !student.parent.phone)) throw new AppError("An active parent with a phone number must be linked for emergency notifications. Contact the campus team.");
    const hospital = await tx.hospital.findFirst({ where: { id: data.hospitalId, isActive: true } });
    if (!hospital) throw new AppError("This hospital is no longer available");
    const request = await tx.request.create({ data: { ...data, hospitalName: hospital.name, studentId: actor.id, proctorId: student.assignedProctorId, auditLogs: { create: { action: "SUBMITTED", userId: actor.id } } } });
    await queueNotifications(tx, request.id, "PENDING");
    return request;
  });
}

export async function changeRequest(actor: Actor, input: unknown) {
  if (!["PROCTOR", "ADMIN"].includes(actor.role)) throw new AppError("Only proctors and administrators can review requests", 403);
  const data = reviewRequestSchema.parse(input);
  const next = statusMap[data.action];
  return db.$transaction(async tx => {
    const current = await tx.request.findFirst({ where: { AND: [{ id: data.requestId }, requestScope(actor)] } });
    if (!current) throw new AppError("Request not found", 404);
    if (!canTransition(current.status, next)) throw new AppError("Request has already changed. Refresh and try again.", 409);
    const changed = await tx.request.updateMany({ where: { id: current.id, status: current.status }, data: { status: next, proctorNote: data.proctorNote || null, ...(next === "APPROVED" ? { approvedAt: new Date(), passToken: randomBytes(24).toString("hex") } : next === "REJECTED" ? { rejectedAt: new Date() } : { escalatedAt: new Date() }) } });
    if (!changed.count) throw new AppError("Another reviewer has updated this request", 409);
    await tx.auditLog.create({ data: { action: next, note: data.proctorNote || null, requestId: current.id, userId: actor.id } });
    await queueNotifications(tx, current.id, next);
    return { id: current.id, status: next };
  });
}

// Invoked only by the authenticated job endpoint, never by an unguarded server action.
export async function runEscalationJob() {
  const settings = await db.systemSettings.upsert({ where: { id: "default" }, create: { id: "default" }, update: {} });
  const cutoff = new Date(Date.now() - settings.escalationTimeoutMs);
  const due = await db.request.findMany({ where: { status: "PENDING", isEmergency: true, createdAt: { lte: cutoff } }, select: { id: true }, take: 100, orderBy: { createdAt: "asc" } });
  let escalated = 0;
  for (const request of due) {
    const changed = await db.$transaction(async tx => {
      const result = await tx.request.updateMany({ where: { id: request.id, status: "PENDING", isEmergency: true, createdAt: { lte: cutoff } }, data: { status: "ESCALATED", escalatedAt: new Date() } });
      if (!result.count) return false;
      await tx.auditLog.create({ data: { action: "ESCALATED", requestId: request.id, note: "Automatically escalated after the emergency review deadline. Actor: system." } });
      await queueNotifications(tx, request.id, "ESCALATED");
      return true;
    });
    if (changed) escalated++;
  }
  const notifications = await dispatchNotifications();
  await db.loginAttempt.deleteMany({ where: { resetAt: { lt: new Date() } } });
  return { escalated, notifications };
}
