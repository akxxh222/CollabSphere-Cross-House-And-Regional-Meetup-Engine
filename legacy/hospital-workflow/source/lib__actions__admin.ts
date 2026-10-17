"use server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { requireActor } from "@/lib/access";
import { AppError, publicError } from "@/lib/errors";
import { userSchema, hospitalSchema, settingsSchema } from "@/lib/validations";
import { dispatchNotifications } from "@/lib/services/notifications";

export async function saveUser(input: unknown) {
  try {
    const actor = await requireActor(["ADMIN"]);
    const { id, password, ...value } = userSchema.parse(input);
    if (id === actor.id && (!value.isActive || value.role !== "ADMIN"))
      throw new AppError("You cannot deactivate or demote your own account");
    const data = {
      ...value,
      registerNo: value.registerNo || null,
      department: value.department || null,
      phone: value.phone || null,
      parentId: value.role === "STUDENT" ? value.parentId || null : null,
      assignedProctorId: value.role === "STUDENT" ? value.assignedProctorId || null : null,
      ...(password ? { password: await hashPassword(password) } : {}),
    };
    await db.$transaction(async (tx) => {
      if (
        data.parentId &&
        !(await tx.user.findFirst({ where: { id: data.parentId, role: "PARENT", isActive: true } }))
      )
        throw new AppError("Select an active parent");
      if (
        data.assignedProctorId &&
        !(await tx.user.findFirst({
          where: { id: data.assignedProctorId, role: "PROCTOR", isActive: true },
        }))
      )
        throw new AppError("Select an active proctor");
      if (id) {
        const existing = await tx.user.findUniqueOrThrow({
          where: { id },
          include: { _count: { select: { assignedStudents: true, children: true } } },
        });
        if (
          (existing.role !== data.role || !data.isActive) &&
          (existing._count.assignedStudents || existing._count.children)
        )
          throw new AppError(
            "Reassign linked students before changing this account's role or deactivating it",
          );
      }
      const user = id
        ? await tx.user.update({ where: { id }, data })
        : await tx.user.create({ data });
      await tx.auditLog.create({
        data: {
          action: id ? "USER_UPDATED" : "USER_CREATED",
          entityId: user.id,
          userId: actor.id,
          note: `${user.name} · ${user.role} · ${user.isActive ? "active" : "inactive"}`,
        },
      });
    });
    revalidatePath("/admin", "layout");
    return { success: true as const };
  } catch (error) {
    return { success: false as const, error: publicError(error).error };
  }
}
export async function saveHospital(input: unknown) {
  try {
    const actor = await requireActor(["ADMIN"]);
    const { id, ...data } = hospitalSchema.parse(input);
    await db.$transaction(async (tx) => {
      const hospital = id
        ? await tx.hospital.update({ where: { id }, data })
        : await tx.hospital.create({ data });
      await tx.auditLog.create({
        data: {
          action: id ? "HOSPITAL_UPDATED" : "HOSPITAL_CREATED",
          entityId: hospital.id,
          userId: actor.id,
          note: `${hospital.name} · ${hospital.isActive ? "active" : "archived"}`,
        },
      });
    });
    revalidatePath("/admin", "layout");
    revalidatePath("/student", "layout");
    return { success: true as const };
  } catch (error) {
    return { success: false as const, error: publicError(error).error };
  }
}
export async function saveSettings(input: unknown) {
  try {
    const actor = await requireActor(["ADMIN"]);
    const data = settingsSchema.parse(input);
    await db.$transaction(async (tx) => {
      await tx.systemSettings.upsert({
        where: { id: "default" },
        create: { id: "default", ...data },
        update: data,
      });
      await tx.auditLog.create({
        data: {
          action: "SETTINGS_UPDATED",
          userId: actor.id,
          note: `Emergency deadline: ${data.escalationTimeoutMs / 60000} minutes; notification templates updated.`,
        },
      });
    });
    revalidatePath("/admin", "layout");
    return { success: true as const };
  } catch (error) {
    return { success: false as const, error: publicError(error).error };
  }
}
export async function processNotifications() {
  try {
    await requireActor(["ADMIN"]);
    const count = await dispatchNotifications();
    revalidatePath("/admin/notifications");
    return { success: true as const, count };
  } catch (error) {
    return { success: false as const, error: publicError(error).error };
  }
}
