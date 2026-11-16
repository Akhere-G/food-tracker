import { expect, type Page, type TestInfo } from "@playwright/test";
import { completeGuestOnboarding } from "./onboarding";

export function testEmail(testInfo: TestInfo) {
  return `e2e-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}@example.com`;
}

export async function registerWithNutritionPlan(
  page: Page,
  email: string,
) {
  await completeGuestOnboarding(page);
  await page.getByRole("button", { name: "Create my account" }).click();
  await expect(page).toHaveURL(/\/register\?onboarding=1$/);

  await page.getByLabel("Name").fill("E2E User");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill("Foodtracker1!");
  await page.getByLabel("Repeat Password").fill("Foodtracker1!");
  await page
    .getByRole("checkbox", {
      name: "Agree to the terms and conditions and privacy policy",
    })
    .click();
  await page.getByRole("button", { name: "Register" }).click();

  await expect(page).toHaveURL(/\/dashboard$/, { timeout: 20_000 });
  await expect(
    page.getByRole("heading", { name: "Your week" }),
  ).toBeVisible();
}
