import { expect, type Page } from "@playwright/test";

export async function completeGuestOnboarding(page: Page) {
  await page.goto("/onboarding");
  await expect(
    page.getByRole("heading", {
      name: "Let’s build something you can return to",
    }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Continue" }).click();
  await expect(
    page.getByRole("heading", { name: "Let’s get your body basics" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(
    page.getByRole("heading", { name: "Set your goal and pace" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(
    page.getByRole("heading", {
      name: "Tell us what the journey has felt like",
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(
    page.getByRole("heading", { name: "Your plan is ready" }),
  ).toBeVisible();
}
