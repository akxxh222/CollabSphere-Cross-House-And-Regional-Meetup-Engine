import { describe, expect, it } from "vitest";
import { eventSchema, signupSchema } from "../lib/validations";
describe("community validation", () => {
  it("accepts IIT Madras learner applications", () => {
    expect(
      signupSchema.safeParse({
        name: "Test Learner",
        email: "test@ds.study.iitm.ac.in",
        password: "strongpass",
        registerNo: "DS24X001",
        studyProgram: "BS Data Science",
        region: "South",
        city: "Chennai",
      }).success,
    ).toBe(true);
  });
  it("rejects external signup addresses", () => {
    expect(
      signupSchema.safeParse({
        name: "Test Learner",
        email: "test@gmail.com",
        password: "strongpass",
        registerNo: "DS24X001",
        studyProgram: "BS Data Science",
        region: "South",
        city: "Chennai",
      }).success,
    ).toBe(false);
  });
  it("requires an event to end after it starts", () => {
    expect(
      eventSchema.safeParse({
        title: "Regional Study Circle",
        description: "A detailed learner session for local peers.",
        type: "MEETUP",
        region: "South",
        city: "Chennai",
        venue: "Library",
        address: "A full venue address",
        latitude: 13,
        longitude: 80,
        startsAt: "2026-10-20T10:00",
        endsAt: "2026-10-20T09:00",
        capacity: 20,
        points: 20,
        coHostIds: [],
      }).success,
    ).toBe(false);
  });
});
