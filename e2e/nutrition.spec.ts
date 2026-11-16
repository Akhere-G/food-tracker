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

  await page.getByRole("link", { name: "Month" }).click();
  await expect(page).toHaveURL(/period=month/);
  await page.getByRole("link", { name: /^Sodium / }).click();
  await expect(
    page.getByRole("heading", { name: "Sodium", exact: true }),
  ).toBeVisible();
  await expect(page.getByText("0 mg", { exact: true }).first()).toBeVisible();
});
