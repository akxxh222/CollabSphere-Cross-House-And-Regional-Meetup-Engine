import { z } from "zod";
export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(72),
});
export const signupSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email()
    .refine(
      (value) =>
        ["@ds.study.iitm.ac.in", "@study.iitm.ac.in", "@iitm.ac.in"].some((domain) =>
          value.endsWith(domain),
        ),
      "Use your IIT Madras email",
    ),
  password: z.string().min(8).max(72),
  registerNo: z.string().trim().min(4).max(30),
  studyProgram: z.string().trim().min(2).max(80),
  region: z.string().trim().min(2).max(80),
  city: z.string().trim().min(2).max(80),
});
export const eventSchema = z
  .object({
    title: z.string().trim().min(4).max(100),
    description: z.string().trim().min(20).max(2000),
    type: z.enum(["MEETUP", "COWORKING", "STUDY_CIRCLE", "WORKSHOP", "SOCIAL"]),
    region: z.string().trim().min(2).max(80),
    city: z.string().trim().min(2).max(80),
    venue: z.string().trim().min(2).max(120),
    address: z.string().trim().min(5).max(240),
    latitude: z.coerce.number().min(-90).max(90),
    longitude: z.coerce.number().min(-180).max(180),
    startsAt: z.coerce.date(),
    endsAt: z.coerce.date(),
    capacity: z.coerce.number().int().min(2).max(1000),
    points: z.coerce.number().int().min(0).max(500),
    coHostIds: z.array(z.string()).default([]),
  })
  .refine((data) => data.endsAt > data.startsAt, {
    message: "End time must be after start time",
    path: ["endsAt"],
  });
