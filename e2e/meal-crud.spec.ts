import { expect, test } from "@playwright/test";
import { registerWithNutritionPlan, testEmail } from "./helpers/auth";

async function addChickenSoup(page: import("@playwright/test").Page) {
  await page.getByRole("button", { name: "Add food", exact: true }).click();
  await page.getByLabel("Search for a food").fill("chicken");
  await page.getByRole("button", { name: "Chicken soup" }).click();
  await page.getByRole("button", { name: "1 bowl" }).click();
  await page.getByRole("button", { name: "Add Food" }).click();
}

test("adds, replaces and deletes a meal while preventing duplicate foods", async ({
  page,
}, testInfo) => {
  await registerWithNutritionPlan(page, testEmail(testInfo));
  await page.getByRole("link", { name: "Add meal" }).click();
  await expect(page.getByRole("heading", { name: "Add meal" })).toBeVisible();

  await addChickenSoup(page);
  await expect(page.getByText("1 food in this meal")).toBeVisible();
  await addChickenSoup(page);
  await page.keyboard.press("Escape");
  await expect(
    page.getByText("Chicken soup is already in this meal", { exact: false }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Save meal" }).click();
  await expect(page).toHaveURL(/\/meals\?date=/, { timeout: 20_000 });
  await expect(
    page.getByRole("article").getByText("Chicken soup", { exact: true }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Edit meal" }).click();
  await expect(
    page.getByRole("heading", { name: "Update meal" }),
  ).toBeVisible();
  await page
    .getByRole("spinbutton", { name: "Servings 1 bowl", exact: true })
    .filter({ visible: true })
    .fill("2");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page).toHaveURL(/\/meals\?date=/, { timeout: 20_000 });
  await expect(page.getByRole("article")).toContainText("2.00000 X");

  await page.getByRole("link", { name: "Edit meal" }).click();
  await page.getByRole("button", { name: "Delete meal" }).click();
  const dialog = page.getByRole("dialog", { name: "Delete this meal?" });
  await dialog.getByRole("button", { name: "Delete meal" }).click();
  await expect(page.getByText("Nothing logged yet")).toBeVisible();
});
