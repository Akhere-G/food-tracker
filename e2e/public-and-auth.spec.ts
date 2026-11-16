import { expect, test } from "@playwright/test";
import { completeGuestOnboarding } from "./helpers/onboarding";

test("navigates from the public home page into guest onboarding", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: "Food tracking that feels like support, not another test.",
    }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Start as a guest" }).click();

  await expect(page).toHaveURL(/\/onboarding$/);
  await expect(
    page.getByRole("heading", {
      name: "Let’s build something you can return to",
    }),
  ).toBeVisible();
});

test("persists a guest onboarding draft and hands off to registration", async ({
  page,
}) => {
  await page.goto("/onboarding");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByLabel("Current weight (kg)").fill("91.5");
  await expect(page.getByLabel("Current weight (kg)")).toHaveValue("91.5");

  await page.reload();
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByLabel("Current weight (kg)")).toHaveValue("91.5");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Create my account" }).click();

  await expect(page).toHaveURL(/\/register\?onboarding=1$/);
});

test("shows client validation on registration and login", async ({ page }) => {
  await page.goto("/register");
  await page.getByRole("button", { name: "Register" }).click();
  await expect(page.getByText("Name required")).toBeVisible();
  await expect(page.getByText("Password required")).toBeVisible();

  await page.goto("/login");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByText("Password required")).toBeVisible();
});

test("guest onboarding can reach its summary with valid defaults", async ({
  page,
}) => {
  await completeGuestOnboarding(page);
  await expect(page.getByText("Daily energy")).toBeVisible();
});
