import { describe, expect, test } from "vitest";
import { easeOutBack, calculateStars, evaluateGuess } from "@games/number-garden/game";

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

describe("evaluateGuess", () => {
  const idleFlags = { gameRunning: true, bloomAnimating: false, numberPadDisabled: false };

  test("blocked when gameRunning is false", () => {
    expect(evaluateGuess(3, 3, { ...idleFlags, gameRunning: false }, { score: 0, goalScore: 10 })).toBe("blocked");
  });

  test("blocked when bloomAnimating is true", () => {
    expect(evaluateGuess(3, 3, { ...idleFlags, bloomAnimating: true }, { score: 0, goalScore: 10 })).toBe("blocked");
  });

  test("blocked when numberPadDisabled is true", () => {
    expect(evaluateGuess(3, 3, { ...idleFlags, numberPadDisabled: true }, { score: 0, goalScore: 10 })).toBe("blocked");
  });

  test("wrong when guess does not match currentCount", () => {
    expect(evaluateGuess(2, 5, idleFlags, { score: 0, goalScore: 10 })).toBe("wrong");
  });

  test("wrong when guess matches at edge of range", () => {
    expect(evaluateGuess(1, 10, idleFlags, { score: 0, goalScore: 10 })).toBe("wrong");
  });

  test("correct when guess matches and score stays below goal", () => {
    expect(evaluateGuess(5, 5, idleFlags, { score: 3, goalScore: 10 })).toBe("correct");
  });

  test("correct when guess matches and score stays one below goal", () => {
    expect(evaluateGuess(7, 7, idleFlags, { score: 8, goalScore: 10 })).toBe("correct");
  });

  test("win when guess reaches goalScore exactly", () => {
    expect(evaluateGuess(4, 4, idleFlags, { score: 9, goalScore: 10 })).toBe("win");
  });

  test("win when guess exceeds goalScore", () => {
    expect(evaluateGuess(3, 3, idleFlags, { score: 15, goalScore: 10 })).toBe("win");
  });

  test("win from zero score with goalScore of 1", () => {
    expect(evaluateGuess(1, 1, idleFlags, { score: 0, goalScore: 1 })).toBe("win");
  });

  test("blocked takes priority over correct guess", () => {
    expect(evaluateGuess(3, 3, { gameRunning: false, bloomAnimating: false, numberPadDisabled: false }, { score: 0, goalScore: 10 })).toBe("blocked");
    expect(evaluateGuess(3, 3, { gameRunning: true, bloomAnimating: true, numberPadDisabled: false }, { score: 0, goalScore: 10 })).toBe("blocked");
    expect(evaluateGuess(3, 3, { gameRunning: true, bloomAnimating: false, numberPadDisabled: true }, { score: 0, goalScore: 10 })).toBe("blocked");
  });
});
