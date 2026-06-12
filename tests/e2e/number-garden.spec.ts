import { expect, test } from "@playwright/test";

test("Number Garden: game shell renders and navigation works", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto("/");

  await page.locator('[data-game-id="number-garden"] .button').click();
  await expect(page).toHaveURL(/\/games\/number-garden\/?$/);

  await expect(page.locator(".game-shell")).toBeVisible();
  await expect(page.locator(".game-header")).toBeVisible();
  await expect(page.locator("#gardenCanvas")).toBeVisible();
  await expect(page.locator(".ng-number-pad")).toBeVisible();
  await expect(page.locator("#hint")).toBeVisible();

  const numBtns = page.locator(".ng-num-btn");
  await expect(numBtns).toHaveCount(8);

  await expect(page.locator(".ng-num-btn:not(:disabled)").first()).toBeVisible({ timeout: 5000 });

  await page.locator(".ng-num-btn").first().click();
  await expect(
    page.locator(".ng-num-btn.ng-correct, .ng-num-btn.ng-wrong")
  ).toHaveCount(1);

  await page.locator(".game-header-back").click();
  await expect(page).toHaveURL(/\/$/);
});

test("Number Garden: play through to win and verify game-over overlay", async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto("/games/number-garden/");
  await expect(page.locator(".game-shell")).toBeVisible();
  await expect(page.locator(".ng-num-btn:not(:disabled)").first()).toBeVisible({ timeout: 8000 });

  for (let round = 0; round < 14; round++) {
    await expect(page.locator(".ng-num-btn:not(:disabled)").first()).toBeVisible({ timeout: 10000 });

    let found = false;
    for (let n = 1; n <= 8; n++) {
      const btn = page.locator(`.ng-num-btn[data-num="${n}"]`);
      if (!(await btn.isEnabled())) continue;

      await btn.click();

      if ((await page.locator(".ng-num-btn.ng-correct").count()) > 0) {
        found = true;
        break;
      }
    }

    expect(found, `Could not find correct answer in round ${round + 1}`).toBe(true);
  }

  await expect(page.locator("#gameOver")).toHaveClass(/visible/);
  await expect(page.locator("#finalScore")).toContainText("14");

  await page.locator("#playAgainBtn").click();
  await expect(page.locator("#gameOver")).not.toHaveClass(/visible/);
  await expect(page.locator("#score")).toContainText("0");
});
