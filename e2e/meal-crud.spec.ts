import { expect, test, type Request } from "@playwright/test";
import { registerWithNutritionPlan, testEmail } from "./helpers/auth";

async function addChickenSoup(
  page: import("@playwright/test").Page,
  unit = "1 bowl",
) {
  await page.getByRole("button", { name: "Add food", exact: true }).click();
  await page.getByLabel("Search for a food").fill("chicken");
  await page.getByRole("button", { name: "Chicken soup" }).click();
  await page.getByRole("button", { name: unit, exact: true }).click();
  await page.getByRole("button", { name: "Add Food" }).click();
}

async function expectInvalidAmountsToBlockSaving(
  page: import("@playwright/test").Page,
  submitLabel: string,
  inputLabel = "Servings 1 bowl",
) {
  const amount = page.getByRole("spinbutton", {
    name: inputLabel,
    exact: true,
  });
  const editorUrl = page.url();
  const saveRequests: Request[] = [];
  const recordSaveRequest = (request: Request) => {
    if (request.method() === "POST" && request.headers()["next-action"]) {
      saveRequests.push(request);
    }
  };
  page.on("request", recordSaveRequest);

  for (const value of ["", "0", "-1"]) {
    await amount.fill(value);
    await expect(amount).toHaveValue(value);
    await page.getByRole("button", { name: submitLabel, exact: true }).click();
    await expect(
      page.locator('[data-sonner-toast][data-type="error"]').last(),
    ).toHaveText("Enter a serving amount greater than zero for every food.");
    await expect(page).toHaveURL(editorUrl);
    await expect(amount).toHaveValue(value);
  }

  await amount.fill("");
  await expect(amount).toHaveValue("");
  await amount.pressSequentially("0.5");
  await expect(amount).toHaveValue("0.5");
  page.off("request", recordSaveRequest);
  expect(saveRequests).toHaveLength(0);
}

async function expectLongSearchResultToFitDialog(
  page: import("@playwright/test").Page,
) {
  await page.getByRole("button", { name: "Add food", exact: true }).click();
  await page.getByLabel("Search for a food").fill("dumplings");

  const dialog = page.getByRole("dialog", { name: "Add food" });
  const result = dialog.getByRole("button", {
    name: /vegetables excluding carrots/,
  });
  await expect(result).toBeVisible();

  const fitsDialog = await result.evaluate((element) => {
    const dialogContent = element.closest('[data-slot="dialog-content"]');
    if (!dialogContent) return false;

    const resultBounds = element.getBoundingClientRect();
    const dialogBounds = dialogContent.getBoundingClientRect();
    return (
      resultBounds.left >= dialogBounds.left &&
      resultBounds.right <= dialogBounds.right &&
      element.scrollWidth <= element.clientWidth
    );
  });
  expect(fitsDialog).toBe(true);
  await page.keyboard.press("Escape");
}

test("adds, replaces and deletes a meal while preventing duplicate foods", async ({
  page,
}, testInfo) => {
  await registerWithNutritionPlan(page, testEmail(testInfo));
  await page.getByRole("link", { name: "Add meal" }).click();
  await expect(page.getByRole("heading", { name: "Add meal" })).toBeVisible();

  await expectLongSearchResultToFitDialog(page);
  await addChickenSoup(page);
  await expect(page.getByText("1 food in this meal")).toBeVisible();
  await addChickenSoup(page);
  await page.keyboard.press("Escape");
  await expect(
    page.getByText("Chicken soup is already in this meal", { exact: false }),
  ).toBeVisible();

  await expectInvalidAmountsToBlockSaving(page, "Save meal");
  await page.getByRole("button", { name: "Save meal" }).click();
  await expect(page).toHaveURL(/\/meals\?date=/, { timeout: 20_000 });
  await expect(
    page.getByRole("article").getByText("Chicken soup", { exact: true }),
  ).toBeVisible();

  await page.goBack();
  await expect(page.getByRole("heading", { name: "Add meal" })).toBeVisible();
  await expect(page.getByText("0 foods in this meal")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Add the first food to this meal" }),
  ).toBeVisible();
  await page.goForward();
  await expect(
    page.getByRole("article").getByText("Chicken soup", { exact: true }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Edit meal" }).click();
  await expect(
    page.getByRole("heading", { name: "Update meal" }),
  ).toBeVisible();
  await expectInvalidAmountsToBlockSaving(page, "Save changes");
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

test("validates gram amounts before adding and updating a meal", async ({
  page,
}, testInfo) => {
  await registerWithNutritionPlan(page, testEmail(testInfo));
  await page.getByRole("link", { name: "Add meal" }).click();
  await addChickenSoup(page, "Grams");
  await expectInvalidAmountsToBlockSaving(page, "Save meal", "Grams");
  await page.getByRole("button", { name: "Save meal", exact: true }).click();
  await expect(page).toHaveURL(/\/meals\?date=/, { timeout: 20_000 });

  await page.getByRole("link", { name: "Edit meal" }).click();
  await expect(
    page.getByRole("heading", { name: "Update meal" }),
  ).toBeVisible();
  await expectInvalidAmountsToBlockSaving(page, "Save changes", "Grams");
  await page.getByLabel("Grams", { exact: true }).fill("125");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(page).toHaveURL(/\/meals\?date=/, { timeout: 20_000 });
  await expect(page.getByRole("article")).toContainText(/125(?:\.0+)? g/);
});
