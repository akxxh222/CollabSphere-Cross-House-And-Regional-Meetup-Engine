import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { loadEnvConfig } from "@next/env";
import { hospitals } from "./hospitals";
loadEnvConfig(process.cwd());
const db = new PrismaClient();
const password = process.env.DEMO_SEED_PASSWORD ?? "demo1234";
const people = [
  {
    name: "Aarav Admin",
    email: "admin@iitm.ac.in",
    role: "ADMIN" as Role,
    registerNo: "ADM001",
    region: "South",
    city: "Chennai",
    house: "IIT Madras Community",
    latitude: 13.0067,
    longitude: 80.2206,
  },
  {
    name: "Meera Coordinator",
    email: "coordinator@iitm.ac.in",
    role: "COORDINATOR" as Role,
    registerNo: "COORD001",
    region: "South",
    city: "Bengaluru",
    house: "Nilgiri House",
    latitude: 12.9716,
    longitude: 77.5946,
  },
  {
    name: "Kabir Coordinator",
    email: "coordinator2@iitm.ac.in",
    role: "COORDINATOR" as Role,
    registerNo: "COORD002",
    region: "West",
    city: "Mumbai",
    house: "Vindhya House",
    latitude: 19.076,
    longitude: 72.8777,
  },
  {
    name: "Ananya Student",
    email: "student@iitm.ac.in",
    role: "STUDENT" as Role,
    registerNo: "DS24B001",
    region: "South",
    city: "Chennai",
    house: "Nilgiri House",
    studyProgram: "BS Data Science",
    latitude: 13.0827,
    longitude: 80.2707,
  },
];
async function main() {
  const hashed = await bcrypt.hash(password, 12);
  const users = [];
  for (const person of people)
    users.push(
      await db.user.upsert({
        where: { email: person.email },
        update: {
          ...person,
          password: hashed,
          approvalStatus: "APPROVED",
          isActive: true,
          approvedAt: new Date(),
        },
        create: {
          ...person,
          password: hashed,
          approvalStatus: "APPROVED",
          isActive: true,
          approvedAt: new Date(),
        },
      }),
    );
  for (const hospital of hospitals)
    await db.hospital.upsert({
      where: { name: hospital.name },
      update: hospital,
      create: hospital,
    });
  const [admin, c1, c2] = users;
  const now = Date.now();
  const seeds = [
    {
      title: "Chennai Data Science Study Jam",
      description:
        "A focused peer-learning afternoon for problem solving, project reviews, and study planning.",
      type: "STUDY_CIRCLE" as const,
      region: "South",
      city: "Chennai",
      venue: "Anna Centenary Library",
      address: "Kotturpuram, Chennai",
      latitude: 13.0108,
      longitude: 80.2405,
      startsAt: new Date(now + 7 * 86400000),
      endsAt: new Date(now + 7 * 86400000 + 10800000),
      capacity: 50,
      points: 30,
      createdById: c1.id,
    },
    {
      title: "Bengaluru Co-working Saturday",
      description:
        "Bring your laptop and current course goals for a structured coworking sprint with local learners.",
      type: "COWORKING" as const,
      region: "South",
      city: "Bengaluru",
      venue: "Cubbon Park Community Hall",
      address: "Kasturba Road, Bengaluru",
      latitude: 12.9763,
      longitude: 77.5929,
      startsAt: new Date(now + 12 * 86400000),
      endsAt: new Date(now + 12 * 86400000 + 14400000),
      capacity: 80,
      points: 25,
      createdById: c1.id,
    },
    {
      title: "Mumbai Cross-House Project Night",
      description:
        "Nilgiri and Vindhya learners team up to review portfolios and form groups for the next term project.",
      type: "MEETUP" as const,
      region: "West",
      city: "Mumbai",
      venue: "Dadar Social Hub",
      address: "Dadar West, Mumbai",
      latitude: 19.0178,
      longitude: 72.8478,
      startsAt: new Date(now + 18 * 86400000),
      endsAt: new Date(now + 18 * 86400000 + 10800000),
      capacity: 70,
      points: 35,
      createdById: c2.id,
    },
  ];
  for (const item of seeds) {
    const existing = await db.event.findFirst({ where: { title: item.title } });
    if (!existing)
      await db.event.create({
        data: {
          ...item,
          status: "APPROVED",
          reviewedById: admin.id,
          reviewedAt: new Date(),
          hosts: {
            create: [
              {
                userId: item.createdById,
                houseName: item.createdById === c1.id ? "Nilgiri House" : "Vindhya House",
                isLead: true,
              },
            ],
          },
        },
      });
  }
  console.log("Seeded CollabSphere demo accounts and meetups.");
}
main().finally(() => db.$disconnect());
