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
