"use server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { requireActor } from "@/lib/access";
import { eventSchema, signupSchema } from "@/lib/validations";
export type FormResult = { ok: boolean; message: string };
const result = (ok: boolean, message: string): FormResult => ({ ok, message });
export async function signupAction(_: FormResult, form: FormData): Promise<FormResult> {
  const parsed = signupSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return result(false, parsed.error.issues[0].message);
  if (await db.user.findUnique({ where: { email: parsed.data.email } }))
    return result(false, "An account already exists for this email.");
  await db.user.create({
    data: {
      ...parsed.data,
      password: await hashPassword(parsed.data.password),
      role: "STUDENT",
      approvalStatus: "PENDING",
      isActive: false,
    },
  });
  return result(true, "Application received. An admin will review your IIT Madras membership.");
}
export async function createEventAction(_: FormResult, form: FormData): Promise<FormResult> {
  const actor = await requireActor(["ADMIN", "COORDINATOR"]);
  const parsed = eventSchema.safeParse({
    ...Object.fromEntries(form),
    coHostIds: form.getAll("coHostIds"),
  });
  if (!parsed.success) return result(false, parsed.error.issues[0].message);
  const { coHostIds, ...data } = parsed.data;
  const event = await db.event.create({
    data: {
      ...data,
      status: actor.role === "ADMIN" ? "APPROVED" : "PROPOSED",
      createdById: actor.id,
      reviewedById: actor.role === "ADMIN" ? actor.id : null,
      reviewedAt: actor.role === "ADMIN" ? new Date() : null,
      hosts: {
        create: [
          { userId: actor.id, houseName: actor.name, isLead: true },
          ...coHostIds
            .filter((id) => id !== actor.id)
            .map((userId) => ({ userId, houseName: "Partner house" })),
        ],
      },
    },
  });
  await db.auditLog.create({
    data: { action: "EVENT_CREATED", entityId: event.id, userId: actor.id, note: event.title },
  });
  revalidatePath("/");
  return result(
    true,
    actor.role === "ADMIN" ? "Meetup published." : "Meetup sent to the admin for approval.",
  );
}
export async function reviewUserAction(userId: string, decision: "APPROVED" | "REJECTED") {
  const actor = await requireActor(["ADMIN"]);
  await db.user.update({
    where: { id: userId },
    data: {
      approvalStatus: decision,
      isActive: decision === "APPROVED",
      approvedAt: decision === "APPROVED" ? new Date() : null,
      approvedById: actor.id,
    },
  });
  await db.auditLog.create({
    data: { action: `MEMBERSHIP_${decision}`, entityId: userId, userId: actor.id },
  });
  revalidatePath("/admin/members");
}
export async function reviewEventAction(eventId: string, decision: "APPROVED" | "REJECTED") {
  const actor = await requireActor(["ADMIN"]);
  await db.event.update({
    where: { id: eventId },
    data: { status: decision, reviewedById: actor.id, reviewedAt: new Date() },
  });
  await db.auditLog.create({
    data: { action: `EVENT_${decision}`, entityId: eventId, userId: actor.id },
  });
  revalidatePath("/");
}
export async function registerAction(eventId: string) {
  const actor = await requireActor(["STUDENT", "COORDINATOR"]);
  const event = await db.event.findUniqueOrThrow({
    where: { id: eventId },
    include: { _count: { select: { registrations: { where: { status: "REGISTERED" } } } } },
  });
  if (event.status !== "APPROVED") throw new Error("This event is not open for registration");
  const status = event._count.registrations >= event.capacity ? "WAITLISTED" : "REGISTERED";
  await db.registration.upsert({
    where: { eventId_userId: { eventId, userId: actor.id } },
    create: { eventId, userId: actor.id, status },
    update: { status },
  });
  revalidatePath("/");
}
export async function checkInAction(token: string) {
  const actor = await requireActor(["STUDENT", "COORDINATOR"]);
  const event = await db.event.findUniqueOrThrow({ where: { qrToken: token } });
  const registered = await db.registration.findUnique({
    where: { eventId_userId: { eventId: event.id, userId: actor.id } },
  });
  if (!registered || registered.status === "CANCELLED")
    throw new Error("Register before checking in");
  const existing = await db.checkIn.findUnique({
    where: { eventId_userId: { eventId: event.id, userId: actor.id } },
  });
  if (!existing)
    await db.$transaction([
      db.checkIn.create({
        data: { eventId: event.id, userId: actor.id, method: "QR", pointsAwarded: event.points },
      }),
      db.registration.update({
        where: { eventId_userId: { eventId: event.id, userId: actor.id } },
        data: { status: "ATTENDED" },
      }),
      db.user.update({
        where: { id: actor.id },
        data: { activityPoints: { increment: event.points } },
      }),
    ]);
  revalidatePath("/");
}
