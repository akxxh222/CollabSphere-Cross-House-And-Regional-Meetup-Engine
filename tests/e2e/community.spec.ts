import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
async function login(page: any, email: string) {
  for (let attempt = 0; attempt < 3; attempt++) {
    await page.goto("/login");
    await page.getByLabel("Email address").fill(email);
    await page.getByLabel("Password", { exact: true }).fill("demo1234");
    await page.getByRole("button", { name: /sign in/i }).click();
    try {
      await page.waitForURL(/dashboard/, { timeout: 20_000 });
      return;
    } catch {
      if (attempt === 2) throw new Error(`Could not authenticate ${email} after three attempts`);
    }
  }
}
test("public signup explains approval and login is accessible", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByText("Your community is everywhere.")).toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByRole("link", { name: /request access/i }).click();
  await expect(page.getByRole("heading", { name: "Request membership" })).toBeVisible();
});
test("student explores map, meetups and hospital reference", async ({ page }) => {
  await login(page, "student@iitm.ac.in");
  await page.getByRole("link", { name: "Explore map" }).click();
  await expect(page.getByLabel("Interactive regional meetup map")).toBeVisible();
  await expect(page.getByRole("button", { name: /House peer:/ }).first()).toBeVisible();
  await page.getByRole("link", { name: "Meetups" }).click();
  await expect(page.getByText("Chennai Data Science Study Jam")).toBeVisible();
  await page.getByRole("link", { name: "Nearby hospitals" }).click();
  await expect(page.getByText("Optional support reference")).toBeVisible();
  await expect(page.getByText(/does not manage medical visits/i)).toBeVisible();
});
test("coordinator has proposal tools and no membership approvals", async ({ page }) => {
  await login(page, "coordinator@iitm.ac.in");
  await expect(page.getByRole("link", { name: "Create meetup" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Member approvals" })).toHaveCount(0);
  await page.goto("/admin/members");
  await expect(page).toHaveURL(/coordinator\/dashboard/);
});
test("admin sees event and membership approval desks", async ({ page }) => {
  await login(page, "admin@iitm.ac.in");
  await page.getByRole("link", { name: "Meetups" }).click();
  await expect(page.getByRole("heading", { name: "Event approval desk" })).toBeVisible();
  await page.getByRole("link", { name: "Member approvals" }).click();
  await expect(page.getByRole("heading", { name: "Membership approvals" })).toBeVisible();
});
