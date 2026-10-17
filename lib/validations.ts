import { z } from "zod";
export const loginSchema = z.object({ email: z.string().trim().toLowerCase().email("Enter a valid email address"), password: z.string().min(6, "Enter your password").max(128) });
export type LoginInput = z.infer<typeof loginSchema>;
export const submitRequestSchema = z.object({
  reason: z.string().trim().min(20, "Please include at least 20 characters").max(1000),
  hospitalId: z.string().cuid("Choose a hospital"),
  visitDate: z.coerce.date().refine(d => d.getTime() >= Date.now() - 5 * 60_000, "Choose a time in the future"),
  returnDate: z.preprocess(v => v === "" || v === undefined ? null : v, z.coerce.date().nullable()),
  isEmergency: z.boolean().default(false),
}).refine(v => !v.returnDate || v.returnDate > v.visitDate, { path: ["returnDate"], message: "Return must be after departure" });
export type SubmitRequestInput = z.infer<typeof submitRequestSchema>;
export const reviewRequestSchema = z.object({ requestId: z.string().cuid(), action: z.enum(["APPROVE", "REJECT", "ESCALATE"]), proctorNote: z.string().trim().max(500).default("") }).refine(v => v.action !== "REJECT" || v.proctorNote.length >= 5, { path: ["proctorNote"], message: "Explain why this request is rejected" });
export type ReviewRequestInput = z.infer<typeof reviewRequestSchema>;
export const userSchema = z.object({
  id: z.string().cuid().optional(), name: z.string().trim().min(2).max(100), email: z.string().trim().toLowerCase().email(), password: z.string().max(128).optional(),
  role: z.enum(["STUDENT", "PROCTOR", "PARENT", "ADMIN"]), registerNo: z.string().trim().max(30).nullable().optional(), department: z.string().trim().max(100).nullable().optional(),
  phone: z.string().regex(/^\+[1-9]\d{7,14}$/, "Use international format, e.g. +919876543210").or(z.literal("")).nullable().optional(),
  parentId: z.string().cuid().or(z.literal("")).nullable().optional(), assignedProctorId: z.string().cuid().or(z.literal("")).nullable().optional(), isActive: z.boolean().default(true),
}).superRefine((v, ctx) => {
  if ((!v.id || v.password) && (v.password?.length ?? 0) < 10) ctx.addIssue({ code: "custom", path: ["password"], message: "Use at least 10 characters" });
  if (v.role === "STUDENT" && !v.email.endsWith("@iitm.ac.in")) ctx.addIssue({ code: "custom", path: ["email"], message: "Students must use an @iitm.ac.in address" });
});
export const hospitalSchema = z.object({ id: z.string().cuid().optional(), name: z.string().trim().min(3).max(160), address: z.string().trim().min(5).max(300), distanceKm: z.coerce.number().min(0).max(200), phone: z.string().trim().max(30).optional(), emergency: z.boolean().default(false), isActive: z.boolean().default(true) });
export const settingsSchema = z.object({ escalationTimeoutMs: z.coerce.number().int().min(60_000).max(3_600_000), smsTemplate: z.string().trim().min(20).max(500), emailTemplate: z.string().trim().min(20).max(2000) });
