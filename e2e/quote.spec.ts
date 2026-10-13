import { expect, test } from "@playwright/test";

const total = (page: import("@playwright/test").Page) =>
  page.getByTestId("quote-total").textContent().then((t) => Number(t?.replace(/[$,]/g, "")));

test.describe("Quote builder", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("shows a total for the default deck job", async ({ page }) => {
    await expect(page.getByTestId("quote-total")).toContainText("$");
    expect(await total(page)).toBeGreaterThan(0);
    await page.screenshot({ path: "test-results/screens/default-quote.png", fullPage: true });
  });

  test("composite boards cost more than pressure-treated", async ({ page }) => {
    const pt = await total(page);
    await page.getByTestId("deck-material").selectOption("composite");
    await expect.poll(() => total(page)).toBeGreaterThan(pt);
  });

  test("reframing joists raises the price", async ({ page }) => {
    const before = await total(page);
    await page.getByTestId("deck-joists").fill("3");
    await expect(page.getByText("Sister / reframe 3 joist(s)")).toBeVisible();
    await expect.poll(() => total(page)).toBeGreaterThan(before);
  });

  test("adding oak stair treads raises the price", async ({ page }) => {
    const before = await total(page);
    await page.getByTestId("stair-treads").fill("12");
    await expect(page.getByText("Demo existing treads")).toBeVisible();
    await expect.poll(() => total(page)).toBeGreaterThan(before);
    await page.screenshot({ path: "test-results/screens/stair-treads.png", fullPage: true });
  });

  test("glass handrail costs more than wood", async ({ page }) => {
    const wood = await total(page);
    await page.getByTestId("option-handrail-glass").check();
    await expect.poll(() => total(page)).toBeGreaterThan(wood);
    await page.screenshot({ path: "test-results/screens/glass-rail.png", fullPage: true });
  });
});
