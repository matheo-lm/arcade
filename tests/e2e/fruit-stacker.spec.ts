import { expect, test } from "@playwright/test";

interface GameTestApi {
  advanceTime(ms: number): void;
  render_game_to_text(): string;
}

test("Fruit Stacker: game shell renders and navigation works", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto("/");

  await page.locator('[data-game-id="fruit-stacker"] .button').click();
  await expect(page).toHaveURL(/\/games\/fruit-stacker\/?$/);

  await expect(page.locator(".game-shell")).toBeVisible();
  await expect(page.locator(".game-header")).toBeVisible();
  await expect(page.locator("canvas#game")).toBeVisible();
  await expect(page.locator("#board")).toBeVisible();
  await expect(page.locator("#score")).toBeVisible();
  await expect(page.locator("#hint")).toBeVisible();
  await expect(page.locator("#gameOver")).toBeVisible();
  await expect(page.locator("#playAgainBtn")).toBeVisible();

  const gameSettingsPanel = page.locator("#gameSettingsPanel");
  await expect(gameSettingsPanel).toBeHidden();
  await page.click("#gameSettingsMenuBtn");
  await expect(gameSettingsPanel).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(gameSettingsPanel).toBeHidden();

  await page.locator(".game-header-back").click();
  await expect(page).toHaveURL(/\/$/);
});

test("Fruit Stacker: drop fruit and verify game state via exposed API", async ({ page }) => {
  await page.goto("/games/fruit-stacker/");
  await expect(page.locator("canvas#game")).toBeVisible();

  await page.keyboard.press(" ");
  const stateAfterDrop = await page.evaluate(() => {
    const api = window as unknown as GameTestApi;
    api.advanceTime(5000);
    return JSON.parse(api.render_game_to_text());
  });
  expect(stateAfterDrop.mode).toBe("playing");
  expect(stateAfterDrop.fruits.length).toBeGreaterThanOrEqual(1);

  const scoreBefore = stateAfterDrop.score;

  await page.keyboard.press(" ");
  const stateAfterSecond = await page.evaluate(() => {
    const api = window as unknown as GameTestApi;
    api.advanceTime(5000);
    return JSON.parse(api.render_game_to_text());
  });
  expect(stateAfterSecond.fruits.length).toBeGreaterThanOrEqual(2);
  expect(stateAfterSecond.score).toBeGreaterThanOrEqual(scoreBefore);
});

test("Fruit Stacker: game-over triggers from top-line breach and play-again resets", async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto("/games/fruit-stacker/");
  await expect(page.locator("canvas#game")).toBeVisible();

  const result = await page.evaluate(() => {
    const api = window as unknown as GameTestApi;
    let i = 0;
    const maxDrops = 500;

    while (i < maxDrops) {
      i++;
      const canvas = document.querySelector("canvas#game");
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        canvas.dispatchEvent(new PointerEvent("pointerdown", {
          button: 0, clientX: cx, clientY: 310, bubbles: true, cancelable: true
        }));
      }
      api.advanceTime(800);

      const state = JSON.parse(api.render_game_to_text());
      if (state.mode !== "playing") {
        return { mode: state.mode, fruitCount: state.fruits.length, score: state.score };
      }
    }

    const final = JSON.parse(api.render_game_to_text());
    return { mode: final.mode, fruitCount: final.fruits.length, score: final.score };
  });

  expect(result.mode).not.toBe("playing");
  expect(["loss", "win"]).toContain(result.mode);

  await expect(page.locator("#gameOver")).toHaveClass(/visible/);
  await expect(page.locator("#finalScore")).toBeVisible();
  const finalScoreText = await page.locator("#finalScore").textContent();
  expect(finalScoreText).toBeTruthy();

  const dataState = await page.locator("#gameOver").getAttribute("data-state");
  expect(dataState).toBe(result.mode);

  await page.locator("#playAgainBtn").click();
  await expect(page.locator("#gameOver")).not.toHaveClass(/visible/);

  const resetState = await page.evaluate(() => {
    const api = window as unknown as GameTestApi;
    return JSON.parse(api.render_game_to_text());
  });
  expect(resetState.score).toBe(0);
  expect(resetState.mode).toBe("playing");
  expect(resetState.fruits.length).toBe(0);
});
