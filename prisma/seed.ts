import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());
import { PrismaClient, RequestStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";
import { hospitals } from "./hospitals";
const db = new PrismaClient();
async function main() {
  if (process.env.TWILIO_MOCK_MODE === "false" || process.env.EMAIL_MOCK_MODE === "false") throw new Error("Demo seeding requires mock notifications. Do not seed demo recipients into live messaging.");
  const password = await bcrypt.hash(process.env.DEMO_SEED_PASSWORD || "CampusCare2026!", 12);
  const proctor = await db.user.upsert({ where: { email: "proctor@iitm.ac.in" }, update: {}, create: { name: "Dr. Meera Nair", email: "proctor@iitm.ac.in", role: "PROCTOR", password, department: "Student Affairs" } });
  const parent = await db.user.upsert({ where: { email: "parent@example.org" }, update: {}, create: { name: "Ravi Sharma", email: "parent@example.org", role: "PARENT", phone: "+910000000001", password } });
  await db.user.upsert({ where: { email: "admin@iitm.ac.in" }, update: {}, create: { name: "Ananya Rao", email: "admin@iitm.ac.in", role: "ADMIN", password } });
  const otherProctor = await db.user.upsert({ where: { email: "proctor2@iitm.ac.in" }, update: {}, create: { name: "Dr. Karthik Iyer", email: "proctor2@iitm.ac.in", role: "PROCTOR", password } });
  const names = ["Arjun Sharma", "Priya Raman", "Aditya Kumar", "Sneha Menon", "Rohan Das", "Kavya Krishnan"];
  const students = [];
  for (let i=0;i<names.length;i++) {
    const email = i === 0 ? "student@iitm.ac.in" : `student${i+1}@iitm.ac.in`;
    students.push(await db.user.upsert({ where: { email }, update: { assignedProctorId: proctor.id, parentId: i === 0 ? parent.id : undefined }, create: { name: names[i], email, password, role: "STUDENT", registerNo: `CS24B00${i+1}`, department: i%2 ? "Electrical Engineering" : "Computer Science", assignedProctorId: proctor.id, parentId: i === 0 ? parent.id : null } }));
  }
  await db.user.upsert({ where: { email: "unassigned@iitm.ac.in" }, update: {}, create: { name: "Dev Test Student", email: "unassigned@iitm.ac.in", role: "STUDENT", password, assignedProctorId: otherProctor.id } });
  const registry = [];
  for (const hospital of hospitals) registry.push(await db.hospital.upsert({ where: { name: hospital.name }, update: {}, create: hospital }));
  await db.systemSettings.upsert({ where: { id: "default" }, create: { id: "default" }, update: {} });
  const reasons = ["Scheduled follow-up consultation recommended by my physician.", "Routine eye examination and prescription review appointment.", "A dental consultation for a persistent toothache this week.", "Medical consultation for recurring headaches over the last few days."];
  for (let i=0;i<28;i++) {
    const id = `cdemo${String(i).padStart(20,"0")}`;
    if (await db.request.findUnique({ where: { id } })) continue;
    const status: RequestStatus = i<3 ? "PENDING" : i===3 ? "ESCALATED" : i%6===0 ? "REJECTED" : "APPROVED";
    const createdAt = new Date(Date.now() - (i<4 ? i*20*60000 : (i%7)*86400000 + i*3600000/7));
    const student = students[i%students.length]; const hospital = registry[i%registry.length];
    const decisionAt = new Date(createdAt.getTime() + (4+i%13)*60000);
    await db.request.create({ data: { id, studentId: student.id, proctorId: proctor.id, hospitalId: hospital.id, hospitalName: hospital.name, reason: reasons[i%reasons.length], status, createdAt, visitDate: new Date(Date.now()+ (i%4+1)*3600000), returnDate: new Date(Date.now()+ (i%4+5)*3600000), isEmergency: i===3, approvedAt: status === "APPROVED" ? decisionAt : null, rejectedAt: status === "REJECTED" ? decisionAt : null, escalatedAt: status === "ESCALATED" ? decisionAt : null, passToken: status === "APPROVED" ? randomBytes(24).toString("hex") : null, proctorNote: status === "REJECTED" ? "Please confirm the appointment time and submit a revised request." : status === "APPROVED" ? "Approved. Carry your student ID and visit pass." : null, auditLogs: { create: [{ action: "SUBMITTED", userId: student.id, createdAt }, ...(status !== "PENDING" ? [{ action: status, userId: status === "ESCALATED" ? null : proctor.id, createdAt: decisionAt, note: status === "ESCALATED" ? "Demo: automatically escalated after the review deadline." : "Demo review decision." }] : [])] } } });
  }
  console.log("Demo seed complete: 4 roles, linked care teams, 3 hospitals, and 28 sample requests. Existing account passwords were preserved.");
}
main().catch(error => { console.error("Seed failed:", error instanceof Error ? error.message.replace(/postgres(?:ql)?:\/\/\S+/g,"[redacted]") : "Unknown error"); process.exitCode=1; }).finally(() => db.$disconnect());
