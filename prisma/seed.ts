/**
 * Prisma Seed — Creates demo users for all roles
 * Run: npx prisma db seed   (after configuring DATABASE_URL)
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();
const DEMO_PASSWORD = "demo1234";

async function main() {
  console.log("🌱 Seeding database...");

  const hashed = await bcrypt.hash(DEMO_PASSWORD, 12);

  // Upsert so re-runs don't fail
  const student = await db.user.upsert({
    where: { email: "student@iitm.ac.in" },
    update: {},
    create: {
      name: "Arjun Sharma",
      email: "student@iitm.ac.in",
      password: hashed,
      role: "STUDENT",
      registerNo: "MM24B001",
      department: "Computer Science",
      phone: "+919876543210",
    },
  });

  const proctor = await db.user.upsert({
    where: { email: "proctor@iitm.ac.in" },
    update: {},
    create: {
      name: "Dr. Meera Nair",
      email: "proctor@iitm.ac.in",
      password: hashed,
      role: "PROCTOR",
      department: "Student Affairs",
    },
  });

  const admin = await db.user.upsert({
    where: { email: "admin@iitm.ac.in" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@iitm.ac.in",
      password: hashed,
      role: "ADMIN",
    },
  });

  // Seed a sample PENDING request
  const existingRequest = await db.request.findFirst({
    where: { studentId: student.id },
  });

  if (!existingRequest) {
    const request = await db.request.create({
      data: {
        reason: "Experiencing persistent chest pain and shortness of breath since last night. Need medical evaluation urgently.",
        hospitalName: "Sri Ramachandra Medical Centre",
        visitDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        isEmergency: true,
        status: "PENDING",
        studentId: student.id,
      },
    });

    await db.auditLog.create({
      data: {
        action: "SUBMITTED",
        requestId: request.id,
        userId: student.id,
      },
    });

    // Seed an APPROVED request
    const approved = await db.request.create({
      data: {
        reason: "Routine follow-up for blood test results from last month's check-up.",
        hospitalName: "Fortis Malar Hospital",
        visitDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
        isEmergency: false,
        status: "APPROVED",
        proctorNote: "Approved. Please carry your ID card.",
        studentId: student.id,
        proctorId: proctor.id,
        approvedAt: new Date(Date.now() - 23 * 60 * 60 * 1000),
      },
    });

    await db.auditLog.createMany({
      data: [
        { action: "SUBMITTED", requestId: approved.id, userId: student.id },
        { action: "APPROVED",  requestId: approved.id, userId: proctor.id, note: "Approved. Please carry your ID card." },
      ],
    });
  }

  console.log("✅ Seeded users:");
  console.log(`   Student  → student@iitm.ac.in  (password: ${DEMO_PASSWORD})`);
  console.log(`   Proctor  → proctor@iitm.ac.in  (password: ${DEMO_PASSWORD})`);
  console.log(`   Admin    → admin@iitm.ac.in    (password: ${DEMO_PASSWORD})`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
