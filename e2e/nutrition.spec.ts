import { expect, test } from "@playwright/test";
import { registerWithNutritionPlan, testEmail } from "./helpers/auth";

test("shows zero nutrient totals and updates period and nutrient views", async ({
  page,
}, testInfo) => {
  await registerWithNutritionPlan(page, testEmail(testInfo));
  await page.getByRole("link", { name: "Nutrition" }).first().click();

  await expect(
    page.getByRole("heading", { name: "Nutrition detail" }),
  ).toBeVisible();
  await expect(page.getByText("No food sources recorded")).toBeVisible();
  await expect(page.getByText("0 g", { exact: true }).first()).toBeVisible();

  await page.getByRole("button", { name: /^Choose week:/ }).click();
  const weekDialog = page.getByRole("dialog", { name: "Choose a week" });
  await weekDialog.getByLabel("Week").fill("2026-W46");
  await weekDialog.getByRole("button", { name: "View week" }).click();
  await expect(page).toHaveURL(/period=week&date=2026-11-09/);

  await page.getByRole("link", { name: "Month" }).click();
  await expect(page).toHaveURL(/period=month/);
  await page.getByRole("button", { name: /^Choose month:/ }).click();
  const monthDialog = page.getByRole("dialog", { name: "Choose a month" });
  await monthDialog.getByLabel("Month").fill("2026-10");
  await monthDialog.getByRole("button", { name: "View month" }).click();
  await expect(page).toHaveURL(/period=month&date=2026-10-01/);
  await page.getByRole("link", { name: /^Sodium / }).click();
  await expect(
    page.getByRole("heading", { name: "Sodium", exact: true }),
  ).toBeVisible();
  await expect(page.getByText("0 mg", { exact: true }).first()).toBeVisible();
});

test("keeps long nutrient titles within the mobile viewport", async ({
  page,
}, testInfo) => {
  await registerWithNutritionPlan(page, testEmail(testInfo));

  for (const width of [320, 375, 390]) {
    await page.setViewportSize({ width, height: 812 });
    for (const nutrient of [
      "Monounsaturated fat",
      "Polyunsaturated fat",
      "Magnesium",
      "Vitamin B12",
    ]) {
      await page.goto(`/nutrition?nutrient=${encodeURIComponent(nutrient)}`);
      const heading = page.getByRole("heading", { name: nutrient, exact: true });
      await expect(heading).toBeVisible();
      await page.evaluate(() => document.fonts.ready);

      const layout = await heading.evaluate((element) => {
        const title = element.getBoundingClientRect();
        const detail = element.closest("section")!.getBoundingClientRect();
        return {
          viewport: document.documentElement.clientWidth,
          pageWidth: document.documentElement.scrollWidth,
          titleRight: title.right,
          detailRight: detail.right,
          titleFits: element.scrollWidth <= element.clientWidth,
        };
      });
      expect(layout.pageWidth, `${nutrient} at ${width}px`).toBeLessThanOrEqual(
        layout.viewport,
      );
      expect(layout.titleRight).toBeLessThanOrEqual(layout.viewport);
      expect(layout.detailRight).toBeLessThanOrEqual(layout.viewport);
      expect(layout.titleFits).toBe(true);
    }
  }
});
