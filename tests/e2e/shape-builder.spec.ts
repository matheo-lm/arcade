import { expect, test } from "@playwright/test";

test("Shape Builder: game shell renders and navigation works", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto("/");

  await page.locator('[data-game-id="shape-builder"] .button').click();
  await expect(page).toHaveURL(/\/games\/shape-builder\/?$/);

  await expect(page.locator(".game-shell")).toBeVisible();
  await expect(page.locator(".game-header")).toBeVisible();
  await expect(page.locator("#sbCanvas")).toBeVisible();
  await expect(page.locator("#sbPalette")).toBeVisible();
  await expect(page.locator("#hint")).toBeVisible();

  const shapeBtns = page.locator(".sb-shape-btn");
  await expect(shapeBtns).toHaveCount(5);

  await expect(page.locator(".sb-shape-btn.selected")).toHaveCount(1);

  await page.locator(".game-header-back").click();
  await expect(page).toHaveURL(/\/$/);
});

test("Shape Builder: palette selection and canvas interaction", async ({ page }) => {
  await page.goto("/games/shape-builder/");
  await expect(page.locator(".game-shell")).toBeVisible();

  await page.locator(".sb-shape-btn[data-shape='square']").click();
  await expect(page.locator(".sb-shape-btn.selected")).toHaveAttribute("data-shape", "square");

  await page.locator(".sb-shape-btn[data-shape='triangle']").click();
  await expect(page.locator(".sb-shape-btn.selected")).toHaveAttribute("data-shape", "triangle");

  await page.click("#sbCanvas", { position: { x: 240, y: 200 } });

  await expect(page.locator("#score")).toBeVisible();
});
