"use server";
import { revalidatePath } from "next/cache";
import { requireActor } from "@/lib/access";
import { publicError } from "@/lib/errors";
import { createRequest, changeRequest } from "@/lib/services/requests";
import { reviewRequestSchema } from "@/lib/validations";

function refresh() { for (const role of ["student", "proctor", "admin", "parent"]) revalidatePath(`/${role}`, "layout"); }
export async function submitRequest(input: unknown) {
  try { const result = await createRequest(await requireActor(["STUDENT"]), input); refresh(); return { success: true as const, requestId: result.id }; }
  catch (error) { return { success: false as const, error: publicError(error).error }; }
}
export async function reviewRequest(input: unknown) {
  try { await changeRequest(await requireActor(["PROCTOR", "ADMIN"]), input); refresh(); return { success: true as const }; }
  catch (error) { return { success: false as const, error: publicError(error).error }; }
}
export async function bulkReview(input: unknown) {
  try {
    const actor = await requireActor(["ADMIN", "PROCTOR"]);
    const schema = reviewRequestSchema.array().min(1).max(50);
    const items = schema.parse(input);
    const results = [];
    for (const item of items) { try { await changeRequest(actor, item); results.push({ id: item.requestId, success: true }); } catch (error) { results.push({ id: item.requestId, success: false, error: publicError(error).error }); } }
    refresh(); return { success: true as const, results };
  } catch (error) { return { success: false as const, error: publicError(error).error }; }
}
