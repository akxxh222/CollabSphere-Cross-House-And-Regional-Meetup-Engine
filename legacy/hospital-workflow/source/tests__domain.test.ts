import { describe, expect, it } from "vitest";
import { canTransition, isEscalationDue, csvCell, renderTemplate } from "../lib/domain";
import { submitRequestSchema, reviewRequestSchema, userSchema } from "../lib/validations";
describe("request lifecycle", () => {
  it("allows pending reviews and escalated resolution, but never reopens resolved requests", () => {
    expect(canTransition("PENDING", "APPROVED")).toBe(true);
    expect(canTransition("ESCALATED", "REJECTED")).toBe(true);
    expect(canTransition("ESCALATED", "ESCALATED")).toBe(false);
    expect(canTransition("APPROVED", "REJECTED")).toBe(false);
    expect(canTransition("REJECTED", "APPROVED")).toBe(false);
  });
  it("escalates only pending emergencies at the exact configured deadline", () => {
    const request = { status: "PENDING" as const, isEmergency: true, createdAt: new Date(0) };
    expect(isEscalationDue(request, 180000, 179999)).toBe(false);
    expect(isEscalationDue(request, 180000, 180000)).toBe(true);
    expect(isEscalationDue({ ...request, isEmergency: false }, 180000, 999999)).toBe(false);
    expect(isEscalationDue({ ...request, status: "APPROVED" }, 180000, 999999)).toBe(false);
  });
  it("requires a rejection explanation", () => {
    expect(
      reviewRequestSchema.safeParse({
        requestId: "clxxxxxxxxxxxxxxxxxxxxxxx",
        action: "REJECT",
        proctorNote: "",
      }).success,
    ).toBe(false);
  });
  it("rejects backwards return dates", () => {
    expect(
      submitRequestSchema.safeParse({
        reason: "A detailed hospital visit reason",
        hospitalId: "clxxxxxxxxxxxxxxxxxxxxxxx",
        visitDate: new Date(Date.now() + 3600000),
        returnDate: new Date(),
        isEmergency: false,
      }).success,
    ).toBe(false);
  });
});
describe("data boundaries", () => {
  it("neutralizes spreadsheet formulas and escapes quotes", () => {
    expect(csvCell('=HYPERLINK("bad")')).toBe('"\'=HYPERLINK(""bad"")"');
    expect(csvCell("a,b")).toBe('"a,b"');
  });
  it("renders only the supported notification placeholders", () => {
    expect(
      renderTemplate("{student}: {status}; {unknown}", { student: "Arjun", status: "approved" }),
    ).toBe("Arjun: approved; {unknown}");
  });
  it("requires institutional student email but allows external parents", () => {
    const person = {
      name: "A Parent",
      email: "parent@example.org",
      password: "long-password",
      role: "PARENT",
    };
    expect(userSchema.safeParse(person).success).toBe(true);
    expect(userSchema.safeParse({ ...person, role: "STUDENT" }).success).toBe(false);
  });
});
