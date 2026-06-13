import { describe, expect, test, vi } from "vitest";
import {
  clamp,
  type FruitState,
  resolveWorldBounds,
  hasImmediateTopLineBreach,
  hasPumpkinTouch,
  mergeFruits,
  resolveCollisionPair
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

describe("mergeFruits", () => {
  test("returns MergeResult when same type, non-terminal, close enough", () => {
    const a = makeFruit({ type: 0, x: 100, y: 100 });
    const b = makeFruit({ type: 0, x: 106, y: 100 });
    const targetDistance = cherryR * 2;
    const distance = 6;

    const result = mergeFruits(a, b, distance, targetDistance);
    expect(result).not.toBeNull();
    expect(result!.mergedType).toBe(1);
  });

  test("returns null for different types", () => {
    const a = makeFruit({ type: 0, x: 100, y: 100 });
    const b = makeFruit({ type: 1, x: 105, y: 100 });
    const targetDistance = FRUIT_TIERS[0].r + FRUIT_TIERS[1].r;
    const distance = 5;

    expect(mergeFruits(a, b, distance, targetDistance)).toBeNull();
  });

  test("returns null for terminal type (pumpkin)", () => {
    const terminalType = FRUIT_TIERS.length - 1;
    const r = FRUIT_TIERS[terminalType].r;
    const a = makeFruit({ type: terminalType, x: 100, y: 100 });
    const b = makeFruit({ type: terminalType, x: 100 + r, y: 100 });
    const targetDistance = r * 2;
    const distance = r;

    expect(mergeFruits(a, b, distance, targetDistance)).toBeNull();
  });

  test("returns null when distance exceeds 0.98 * targetDistance", () => {
    const a = makeFruit({ type: 0, x: 100, y: 100 });
    const b = makeFruit({ type: 0, x: 100, y: 100 + cherryR * 2.5 });
    const targetDistance = cherryR * 2;
    const distance = cherryR * 2.5;

    expect(mergeFruits(a, b, distance, targetDistance)).toBeNull();
  });

  test("computes correct midpoint coordinates", () => {
    const a = makeFruit({ type: 0, x: 100, y: 200 });
    const b = makeFruit({ type: 0, x: 110, y: 220 });
    const targetDistance = cherryR * 2;
    const distance = Math.hypot(10, 20);

    const result = mergeFruits(a, b, distance, targetDistance);
    expect(result!.x).toBe(105);
    expect(result!.y).toBe(210);
  });

  test("computes correct combined velocity", () => {
    const a = makeFruit({ type: 0, x: 100, y: 100, vx: 2, vy: -3 });
    const b = makeFruit({ type: 0, x: 105, y: 100, vx: -1, vy: -5 });
    const targetDistance = cherryR * 2;
    const distance = 5;

    const result = mergeFruits(a, b, distance, targetDistance);
    expect(result!.vx).toBe((2 + -1) * 0.35);
    expect(result!.vy).toBe(Math.min(-3, -5) - 0.65);
  });

  test("does not mutate input fruits", () => {
    const a = makeFruit({ type: 0, x: 100, y: 100, vx: 2, vy: 0 });
    const b = makeFruit({ type: 0, x: 105, y: 100, vx: -1, vy: 0 });
    const targetDistance = cherryR * 2;
    const distance = 5;

    const a0 = { ...a };
    const b0 = { ...b };
    mergeFruits(a, b, distance, targetDistance);
    expect(a).toEqual(a0);
    expect(b).toEqual(b0);
  });
});

describe("resolveCollisionPair", () => {
  test("does nothing when fruits are far apart", () => {
    const a = makeFruit({ type: 0, x: 0, y: 0 });
    const b = makeFruit({ type: 1, x: 500, y: 500 });
    const mergeFn = vi.fn();

    resolveCollisionPair(a, b, mergeFn);
    expect(a.x).toBe(0);
    expect(b.x).toBe(500);
    expect(mergeFn).not.toHaveBeenCalled();
  });

  test("calls mergeFn when fruits overlap and returns early on success", () => {
    const a = makeFruit({ type: 0, x: 100, y: 100 });
    const b = makeFruit({ type: 0, x: 105, y: 100 });
    const mergeFn = vi.fn().mockReturnValue(true);

    resolveCollisionPair(a, b, mergeFn);
    expect(mergeFn).toHaveBeenCalledOnce();
    expect(a.x).toBe(100);
    expect(b.x).toBe(105);
  });

  test("handles zero distance edge case without crash", () => {
    const a = makeFruit({ type: 0, x: 100, y: 100 });
    const b = makeFruit({ type: 0, x: 100, y: 100 });
    const mergeFn = vi.fn().mockReturnValue(false);

    expect(() => resolveCollisionPair(a, b, mergeFn)).not.toThrow();
    expect(mergeFn).toHaveBeenCalled();
    expect(a.x).not.toBeNaN();
    expect(a.y).not.toBeNaN();
    expect(b.x).not.toBeNaN();
    expect(b.y).not.toBeNaN();
  });

  test("pushes overlapping different-type fruits apart when no merge", () => {
    const a = makeFruit({ type: 0, x: 100, y: 100 });
    const b = makeFruit({ type: 1, x: 100, y: 100 });
    const mergeFn = vi.fn().mockReturnValue(false);

    resolveCollisionPair(a, b, mergeFn);
    expect(mergeFn).toHaveBeenCalled();
    expect(a.x).not.toBe(100);
    expect(b.x).not.toBe(100);
  });

  test("applies impulse for approaching fruits and not for separating", () => {
    const a = makeFruit({ type: 0, x: 100, y: 100, vx: 5, vy: 0 });
    const b = makeFruit({ type: 1, x: 110, y: 100, vx: -5, vy: 0 });
    const mergeFn = vi.fn().mockReturnValue(false);

    resolveCollisionPair(a, b, mergeFn);
    expect(a.vx).toBeLessThan(5);
    expect(b.vx).toBeGreaterThan(-5);
  });

  test("integration with mergeFruits: detects merge for touching same-type fruits", () => {
    const a = makeFruit({ type: 0, x: 100, y: 100 });
    const b = makeFruit({ type: 0, x: 100 + cherryR * 1.5, y: 100 });
    const wrapMerge = (a: FruitState, b: FruitState, d: number, td: number): boolean =>
      mergeFruits(a, b, d, td) !== null;

    expect(resolveCollisionPair(a, b, wrapMerge)).toBeUndefined();
    expect(a.x).toBe(100);
    expect(b.x).toBe(100 + cherryR * 1.5);
    expect(a.merged).toBe(false);
    expect(b.merged).toBe(false);
  });
});
