import { expect, test } from "@playwright/test";
import { registerWithNutritionPlan, testEmail } from "./helpers/auth";

test("shows authenticated dashboard and meal empty states", async ({
  page,
}, testInfo) => {
  await registerWithNutritionPlan(page, testEmail(testInfo));
  await expect(page.getByText("Daily average")).toBeVisible();
  await expect(page.getByText("Your next meal is a fresh start.")).toBeVisible();

  await page.getByRole("link", { name: "Meals" }).first().click();
  await expect(page).toHaveURL(/\/meals/);
  await expect(page.getByText("Nothing logged yet")).toBeVisible();
  await expect(
    page.getByRole("region", { name: "Daily nutrition totals" }),
  ).toBeVisible();
});
