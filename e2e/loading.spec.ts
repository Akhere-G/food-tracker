import { expect, test } from "@playwright/test";
import { registerWithNutritionPlan, testEmail } from "./helpers/auth";

// Give this suite its own simulated client so registrations don't share the
// authentication rate-limit bucket with the existing account-flow tests.
test.use({ extraHTTPHeaders: { "X-Forwarded-For": "192.0.2.120" } });

test("food skeletons preserve input, respect motion preferences, and resolve", async ({
  page,
}, testInfo) => {
  await registerWithNutritionPlan(page, testEmail(testInfo));
  await page.getByRole("link", { name: "Add meal" }).click();
  await expect(page.getByRole("heading", { name: "Add meal" })).toBeVisible();

  let release = () => {};
  let pendingResponse = new Promise<void>((resolve) => { release = resolve; });
  await page.route("**/addmeal", async (route) => {
    if (route.request().method() === "POST") await pendingResponse;
    await route.continue();
  });

  await page.getByRole("button", { name: "Add food", exact: true }).click();
  const search = page.getByLabel("Search for a food");
  await search.fill("chicken");
  const searchSkeleton = page.locator('[data-loading="Searching foods…"]');
  await expect(searchSkeleton).toBeVisible();
  await expect(search).toHaveValue("chicken");
  await expect(page.getByRole("status")).toContainText("Searching foods…");
  await expect(page.getByRole("button", { name: "Chicken soup" })).toHaveCount(0);

  const shape = searchSkeleton.locator('[data-slot="skeleton"]').first();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(shape).toHaveCSS("animation-name", "pulse");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(shape).toHaveCSS("animation-name", "none");

  const lightColour = await shape.evaluate((element) => getComputedStyle(element).backgroundColor);
  await page.evaluate(() => document.documentElement.classList.add("dark"));
  const darkColour = await shape.evaluate((element) => getComputedStyle(element).backgroundColor);
  expect(darkColour).not.toBe(lightColour);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(searchSkeleton).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("food-search-skeleton-mobile-dark.png") });

  release();
  await expect(page.getByRole("button", { name: "Chicken soup" })).toBeVisible();
  await expect(searchSkeleton).toHaveCount(0);

  pendingResponse = new Promise<void>((resolve) => { release = resolve; });
  await page.getByRole("button", { name: "Chicken soup" }).click();
  const servingSkeleton = page.locator('[data-loading="Loading serving sizes…"]');
  await expect(servingSkeleton).toBeVisible();
  await expect(page.getByText("Chicken soup", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Add Food", exact: true })).toBeDisabled();
  release();
  await expect(page.getByRole("button", { name: "1 bowl" })).toBeVisible();
  await expect(servingSkeleton).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Add Food", exact: true })).toBeEnabled();

  await page.getByRole("button", { name: "Back to food search" }).click();
  await page.unroute("**/addmeal");
  await page.route("**/addmeal", async (route) => {
    if (route.request().method() === "POST") await route.abort("failed");
    else await route.continue();
  });
  await search.fill("chicken");
  await expect(page.getByRole("alert")).toContainText("We could not search for foods.");
  await expect(searchSkeleton).toHaveCount(0);
  await expect(search).toHaveValue("chicken");
  await page.unroute("**/addmeal");
  await search.fill("chicken soup");
  await expect(page.getByRole("button", { name: "Chicken soup" })).toBeVisible();
});

test("report period updates keep existing content visible while pending", async ({ page }, testInfo) => {
  await registerWithNutritionPlan(page, testEmail(testInfo));
  let release = () => {};
  const pendingResponse = new Promise<void>((resolve) => { release = resolve; });
  let markRequested = () => {};
  const requested = new Promise<void>((resolve) => { markRequested = resolve; });
  await page.route((url) => url.pathname === "/dashboard" && url.searchParams.get("period") === "month", async (route) => {
    markRequested();
    await pendingResponse;
    await route.continue();
  });

  try {
    await page.getByRole("link", { name: "month", exact: true }).click({ noWaitAfter: true });
    await requested;
    await expect(page.getByRole("heading", { name: "Your week" })).toBeVisible();
    await expect(page.getByText("Daily average")).toBeVisible();
    await expect(page.locator("[data-loading]:visible")).toHaveCount(0);
  } finally {
    release();
  }
  await expect(page.getByRole("heading", { name: "Your month" })).toBeVisible();
});
