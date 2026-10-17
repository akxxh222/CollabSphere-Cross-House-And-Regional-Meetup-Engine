import { test, expect, Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
const password = process.env.DEMO_SEED_PASSWORD || "demo1234";
const baseURL = process.env.E2E_BASE_URL || "http://localhost:3000";
let requestId = "";
async function login(page: Page, email: string) {
  await page.goto("/login");
  await page.getByLabel("Email address", { exact: true }).fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Sign in to your workspace" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
}
function localTime(date: Date) {
  return date.toLocaleString("sv-SE", { timeZone: "Asia/Kolkata" }).slice(0, 16).replace(" ", "T");
}
test.describe.serial("CampusCare end-to-end", () => {
  test.afterAll(async () => {
    await db.$disconnect();
  });
  test("login is accessible and protected endpoints reject anonymous access", async ({
    page,
    request,
  }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "Welcome back." })).toBeVisible();
    expect((await request.get("/api/requests")).status()).toBe(401);
    expect((await request.get("/api/jobs/escalate")).status()).toBe(401);
    await page.screenshot({ path: ".artifacts/login-desktop.png", fullPage: true });
    const audit = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(audit.violations).toEqual([]);
  });
  test("student submits a visit with server validation and role guards", async ({ page }) => {
    await login(page, "student@iitm.ac.in");
    await page.screenshot({ path: ".artifacts/student-desktop.png", fullPage: true });
    await page.goto("/admin/dashboard");
    await expect(page).toHaveURL(/\/student\/dashboard$/);
    await page.goto("/student/new");
    await page.getByLabel("Hospital", { exact: true }).selectOption({ index: 1 });
    await page.getByLabel("Departure date & time").fill(localTime(new Date(Date.now() + 7200000)));
    await page
      .getByLabel("Expected return", { exact: false })
      .fill(localTime(new Date(Date.now() + 14400000)));
    await page
      .getByLabel("Reason for your visit")
      .fill("E2E verification: scheduled medical follow-up consultation.");
    await page.getByRole("button", { name: "Submit visit request" }).click();
    await expect(page).toHaveURL(/\/student\/requests\/c/);
    requestId = page.url().split("/").pop()!;
    await expect(page.getByText("submitted", { exact: true })).toBeVisible();
    const denied = await page.request.patch(`/api/requests/${requestId}`, {
      headers: { Origin: baseURL },
      data: { action: "APPROVE", proctorNote: "Not allowed" },
    });
    expect(denied.status()).toBe(403);
    const csrf = await page.request.post("/api/requests", {
      headers: { Origin: "https://untrusted.example" },
      data: {},
    });
    expect(csrf.status()).toBe(403);
  });
  test("unassigned proctor cannot read or change another care team's request", async ({ page }) => {
    await login(page, "proctor2@iitm.ac.in");
    const response = await page.request.patch(`/api/requests/${requestId}`, {
      headers: { Origin: baseURL },
      data: { action: "APPROVE", proctorNote: "Forbidden" },
    });
    expect(response.status()).toBe(404);
    const list = await (await page.request.get("/api/requests")).json();
    expect(list.rows.some((r: { id: string }) => r.id === requestId)).toBe(false);
    expect((await page.request.get(`/api/requests/${requestId}/qr`)).status()).toBe(404);
  });
  test("assigned proctor approves and the public QR pass excludes medical details", async ({
    page,
    request,
  }) => {
    await login(page, "proctor@iitm.ac.in");
    await page.goto(`/proctor/requests/${requestId}`);
    await page
      .getByLabel("Comment", { exact: true })
      .fill("Approved for the scheduled consultation. Carry your student ID.");
    await page.getByRole("button", { name: "Approve", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Your visit pass" })).toBeVisible();
    const qr = await page.request.get(`/api/requests/${requestId}/qr`);
    expect(qr.status()).toBe(200);
    expect(qr.headers()["content-type"]).toBe("image/png");
    const row = await db.request.findUniqueOrThrow({ where: { id: requestId } });
    const verification = await request.get(`/verify/${row.passToken}`);
    const html = await verification.text();
    expect(html).toContain("Verified visit authorization");
    expect(html).not.toContain(row.reason);
    const repeated = await page.request.patch(`/api/requests/${requestId}`, {
      headers: { Origin: baseURL },
      data: { action: "REJECT", proctorNote: "Late rejection must fail" },
    });
    expect(repeated.status()).toBe(409);
    await page.screenshot({ path: ".artifacts/approved-pass.png", fullPage: true });
  });
  test("parent sees only linked children", async ({ page }) => {
    await login(page, "parent@example.org");
    const response = await page.request.get("/api/requests");
    expect(response.status()).toBe(200);
    const list = await response.json();
    expect(list.rows.length).toBeGreaterThan(0);
    expect(
      list.rows.every((r: { student: { name: string } }) => r.student.name === "Arjun Sharma"),
    ).toBe(true);
  });
  test("overdue emergency escalates once and creates simulated SMS plus email", async ({
    page,
    request,
  }) => {
    await login(page, "student@iitm.ac.in");
    const hospital = await db.hospital.findFirstOrThrow({ where: { isActive: true } });
    const response = await page.request.post("/api/requests", {
      headers: { Origin: baseURL },
      data: {
        reason: "E2E verification: emergency escalation deadline simulation.",
        hospitalId: hospital.id,
        visitDate: new Date(Date.now() + 3600000).toISOString(),
        returnDate: null,
        isEmergency: true,
      },
    });
    expect(response.status()).toBe(201);
    const { id } = await response.json();
    await db.request.update({ where: { id }, data: { createdAt: new Date(Date.now() - 240000) } });
    const headers = { Authorization: `Bearer ${process.env.CRON_SECRET}` };
    expect((await request.get("/api/jobs/escalate", { headers })).status()).toBe(200);
    expect((await request.get("/api/jobs/escalate", { headers })).status()).toBe(200);
    expect((await db.request.findUniqueOrThrow({ where: { id } })).status).toBe("ESCALATED");
    expect(await db.auditLog.count({ where: { requestId: id, action: "ESCALATED" } })).toBe(1);
    const messages = await db.notification.findMany({ where: { requestId: id } });
    expect(messages.filter((m) => m.type === "SMS")).toHaveLength(1);
    expect(messages.every((m) => m.status === "MOCK")).toBe(true);
  });
  test("admin pages work, exports are scoped, and settings persist", async ({ page }) => {
    await login(page, "admin@iitm.ac.in");
    await page.screenshot({ path: ".artifacts/admin-desktop.png", fullPage: true });
    for (const path of ["requests", "users", "hospitals", "notifications", "audit", "settings"]) {
      await page.goto(`/admin/${path}`);
      await expect(page.locator("main h1")).toBeVisible();
      await expect(page.getByText("We couldn’t load this page.")).toHaveCount(0);
    }
    await page.getByLabel("Review deadline (minutes)").fill("4");
    await page.getByRole("button", { name: "Save settings" }).click();
    await expect(page.getByText("System settings saved")).toBeVisible();
    expect(
      (await db.systemSettings.findUniqueOrThrow({ where: { id: "default" } })).escalationTimeoutMs,
    ).toBe(240000);
    await page.getByLabel("Review deadline (minutes)").fill("3");
    await page.getByRole("button", { name: "Save settings" }).click();
    await expect
      .poll(
        async () =>
          (await db.systemSettings.findUniqueOrThrow({ where: { id: "default" } }))
            .escalationTimeoutMs,
      )
      .toBe(180000);
    const csv = await page.request.get("/api/requests/export?status=APPROVED");
    expect(csv.status()).toBe(200);
    expect(await csv.text()).toContain("APPROVED");
    await page.goto("/admin/dashboard");
    const audit = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(audit.violations).toEqual([]);
  });
  test("mobile navigation, layout, and dark theme remain usable", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await login(page, "student@iitm.ac.in");
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
    await page.getByRole("button", { name: "Toggle navigation" }).click();
    await page.getByRole("link", { name: "My requests", exact: true }).click();
    await expect(page).toHaveURL(/\/student\/requests$/);
    await page.getByRole("button", { name: "Toggle color theme" }).click();
    await expect(page.locator("html")).toHaveClass(/dark/);
    await page.screenshot({ path: ".artifacts/student-mobile-dark.png", fullPage: true });
    const audit = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(audit.violations).toEqual([]);
  });
});
