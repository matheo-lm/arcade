import { describe, expect, test } from "vitest";
import { easeOutBack, calculateStars } from "@games/number-garden/game";

describe("easeOutBack", () => {
  test("near 0 at t=0 (floating point)", () => {
    expect(easeOutBack(0)).toBeCloseTo(0, 10);
  });

  test("returns 1 at t=1", () => {
    expect(easeOutBack(1)).toBe(1);
  });

  test("is below 1 early and overshoots above 1 starting ~t=0.4", () => {
    expect(easeOutBack(0.3)).toBeLessThan(1);
    expect(easeOutBack(0.5)).toBeGreaterThan(1);
    expect(easeOutBack(0.9)).toBeGreaterThan(1);
  });

  test("stays above 1 until very close to t=1", () => {
    expect(easeOutBack(0.97)).toBeGreaterThan(1);
  });

  test("peak near t=0.6 is higher than surrounding values", () => {
    const peak = easeOutBack(0.6);
    expect(peak).toBeGreaterThan(easeOutBack(0.4));
    expect(peak).toBeGreaterThan(easeOutBack(0.8));
  });
});

describe("calculateStars", () => {
  const goal = 10;

  test("returns 0 for score below 60% of goal", () => {
    expect(calculateStars(0, goal)).toBe(0);
    expect(calculateStars(5, goal)).toBe(0);
  });

  test("returns 1 for score at 60% of goal", () => {
    expect(calculateStars(6, goal)).toBe(1);
  });

  test("returns 1 for score between 60% and goal", () => {
    expect(calculateStars(7, goal)).toBe(1);
    expect(calculateStars(9, goal)).toBe(1);
  });

  test("returns 2 for score at exactly goal", () => {
    expect(calculateStars(10, goal)).toBe(2);
  });

  test("returns 2 for score above goal but below 140%", () => {
    expect(calculateStars(11, goal)).toBe(2);
    expect(calculateStars(13, goal)).toBe(2);
  });

  test("returns 3 for score at 140% of goal", () => {
    expect(calculateStars(14, goal)).toBe(3);
  });

  test("returns 3 for score above 140% of goal", () => {
    expect(calculateStars(20, goal)).toBe(3);
  });

});
