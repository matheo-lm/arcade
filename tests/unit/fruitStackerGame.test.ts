import { describe, expect, test } from "vitest";
import {
  clamp,
  type FruitState,
  resolveWorldBounds,
  hasImmediateTopLineBreach,
  hasPumpkinTouch
} from "@games/fruit-stacker/game";
import { FRUIT_TIERS } from "@games/fruit-stacker/config";

const cherryR = FRUIT_TIERS[0].r;
const pumpkinR = FRUIT_TIERS[FRUIT_TIERS.length - 1].r;

const makeFruit = (overrides: Partial<FruitState>): FruitState => ({
  id: "test",
  type: 0,
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  airDrift: 0,
  ageFrames: 100,
  eligibleForTopLoss: true,
  merged: false,
  ...overrides
});

describe("clamp", () => {
  test("returns value within range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  test("clamps to min", () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  test("clamps to max", () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  test("handles edge equality", () => {
    expect(clamp(0, 0, 10)).toBe(0);
    expect(clamp(10, 0, 10)).toBe(10);
  });
});

describe("resolveWorldBounds", () => {
  const bw = 400;
  const bh = 600;

  test("does nothing when fruit is inside bounds", () => {
    const fruit = makeFruit({ x: 200, y: 300, vx: 1, vy: 1 });
    resolveWorldBounds(fruit, bw, bh);
    expect(fruit.x).toBe(200);
    expect(fruit.y).toBe(300);
    expect(fruit.vx).toBe(1);
    expect(fruit.vy).toBe(1);
  });

  test("bounces off left wall", () => {
    const fruit = makeFruit({ x: 0, y: 300, vx: -5, vy: 0 });
    resolveWorldBounds(fruit, bw, bh);
    expect(fruit.x).toBe(cherryR + 3);
    expect(fruit.vx).toBeGreaterThan(0);
  });

  test("bounces off right wall", () => {
    const fruit = makeFruit({ x: bw, y: 300, vx: 5, vy: 0 });
    resolveWorldBounds(fruit, bw, bh);
    expect(fruit.x).toBe(bw - cherryR - 3);
    expect(fruit.vx).toBeLessThan(0);
  });

  test("bounces off floor", () => {
    const fruit = makeFruit({ x: 200, y: bh + 100, vx: 0, vy: 5 });
    resolveWorldBounds(fruit, bw, bh);
    expect(fruit.y).toBe(bh - cherryR - 3);
    expect(fruit.vy).toBeLessThan(0);
  });

  test("stops vertical velocity when below rest threshold", () => {
    const fruit = makeFruit({ x: 200, y: bh + 100, vx: 0, vy: 0.03 });
    resolveWorldBounds(fruit, bw, bh);
    expect(fruit.vy).toBe(0);
  });

  test("handles large fruit (pumpkin) near walls", () => {
    const fruit = makeFruit({ type: FRUIT_TIERS.length - 1, x: 0, y: 300, vx: -5, vy: 0 });
    resolveWorldBounds(fruit, bw, bh);
    expect(fruit.x).toBe(pumpkinR + 3);
  });
});

describe("hasImmediateTopLineBreach", () => {
  const fruitBelowTop = (y: number): FruitState =>
    makeFruit({ x: 200, y, type: 0 });

  test("returns false when no fruits are above top line", () => {
    const fruits = [fruitBelowTop(150)];
    expect(hasImmediateTopLineBreach(fruits)).toBe(false);
  });

  test("returns true when a fruit is above top line", () => {
    const fruits = [fruitBelowTop(50)];
    expect(hasImmediateTopLineBreach(fruits)).toBe(true);
  });

  test("ignores merged fruits", () => {
    const fruits = [makeFruit({ x: 200, y: 50, merged: true })];
    expect(hasImmediateTopLineBreach(fruits)).toBe(false);
  });

  test("ignores fruits in spawn exemption window", () => {
    const fruits = [makeFruit({ x: 200, y: 50, ageFrames: 5 })];
    expect(hasImmediateTopLineBreach(fruits)).toBe(false);
  });

  test("respects fruits past spawn exemption window", () => {
    const fruits = [makeFruit({ x: 200, y: 50, ageFrames: 19 })];
    expect(hasImmediateTopLineBreach(fruits)).toBe(true);
  });

  test("ignores fruits not eligible for top loss", () => {
    const fruits = [makeFruit({ x: 200, y: 50, eligibleForTopLoss: false })];
    expect(hasImmediateTopLineBreach(fruits)).toBe(false);
  });

  test("detects breach among many in-bounds fruits", () => {
    const fruits = [
      makeFruit({ x: 100, y: 200 }),
      makeFruit({ x: 300, y: 150 }),
      makeFruit({ x: 200, y: 50 })
    ];
    expect(hasImmediateTopLineBreach(fruits)).toBe(true);
  });

  test("returns false for empty array", () => {
    expect(hasImmediateTopLineBreach([])).toBe(false);
  });
});

describe("hasPumpkinTouch", () => {
  const pumpkin = (x: number, y: number, overrides?: Partial<FruitState>): FruitState =>
    makeFruit({
      type: FRUIT_TIERS.length - 1,
      x,
      y,
      ...overrides
    });

  test("returns false with fewer than 2 pumpkins", () => {
    expect(hasPumpkinTouch([pumpkin(100, 100)])).toBe(false);
  });

  test("returns false when pumpkins are far apart", () => {
    const pumpkins = [pumpkin(100, 100), pumpkin(500, 500)];
    expect(hasPumpkinTouch(pumpkins)).toBe(false);
  });

  test("returns true when pumpkins are touching", () => {
    const pumpkins = [pumpkin(100, 100), pumpkin(100 + pumpkinR * 1.5, 100)];
    expect(hasPumpkinTouch(pumpkins)).toBe(true);
  });

  test("returns true when pumpkins are overlapping", () => {
    const pumpkins = [pumpkin(100, 100), pumpkin(100, 100)];
    expect(hasPumpkinTouch(pumpkins)).toBe(true);
  });

  test("ignores merged pumpkins", () => {
    const pumpkins = [
      pumpkin(100, 100),
      pumpkin(105, 100, { merged: true })
    ];
    expect(hasPumpkinTouch(pumpkins)).toBe(false);
  });

  test("ignores non-pumpkin fruits even when touching", () => {
    const fruits = [
      makeFruit({ type: 0, x: 100, y: 100 }),
      makeFruit({ type: 0, x: 105, y: 100 })
    ];
    expect(hasPumpkinTouch(fruits)).toBe(false);
  });

  test("returns false for empty array", () => {
    expect(hasPumpkinTouch([])).toBe(false);
  });

  test("returns true with many pumpkins where two touch", () => {
    const pumpkins = [
      pumpkin(50, 50),
      pumpkin(500, 500),
      pumpkin(100, 100),
      pumpkin(100 + pumpkinR * 1.5, 100)
    ];
    expect(hasPumpkinTouch(pumpkins)).toBe(true);
  });
});
