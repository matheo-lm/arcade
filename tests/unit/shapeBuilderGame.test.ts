import { describe, expect, it } from "vitest";
import {
  evaluatePlacement,
  calculateStars,
  getTemplates,
  type ShapeType,
  type TemplateShape,
} from "@games/shape-builder/game";

const shape = (overrides: Partial<TemplateShape> = {}): TemplateShape => ({
  type: "circle",
  color: "#000",
  x: 0.5,
  y: 0.5,
  w: 0.1,
  h: 0.1,
  ...overrides,
});

describe("evaluatePlacement", () => {
  it("matches same-type shape within threshold", () => {
    const unplaced = [shape({ type: "circle", x: 0.5, y: 0.5 })];
    const result = evaluatePlacement("circle", 0.5, 0.5, unplaced, 0.1);
    expect(result.matched).toBe(true);
    expect(result.placedShape).toEqual(unplaced[0]);
  });

  it("returns not matched for different type", () => {
    const unplaced = [shape({ type: "square", x: 0.5, y: 0.5 })];
    const result = evaluatePlacement("circle", 0.5, 0.5, unplaced, 0.1);
    expect(result.matched).toBe(false);
    expect(result.placedShape).toBeNull();
  });

  it("returns not matched when too far from target", () => {
    const unplaced = [shape({ type: "circle", x: 0.5, y: 0.5 })];
    const result = evaluatePlacement("circle", 0.9, 0.9, unplaced, 0.1);
    expect(result.matched).toBe(false);
    expect(result.placedShape).toBeNull();
  });

  it("matches closest shape when multiple of same type", () => {
    const unplaced = [
      shape({ type: "circle", x: 0.2, y: 0.2 }),
      shape({ type: "circle", x: 0.5, y: 0.5 }),
      shape({ type: "circle", x: 0.8, y: 0.8 }),
    ];
    const result = evaluatePlacement("circle", 0.5, 0.5, unplaced, 0.1);
    expect(result.matched).toBe(true);
    expect(result.placedShape).toEqual(unplaced[1]);
  });

  it("signals round complete when last shape placed", () => {
    const unplaced = [shape({ type: "circle", x: 0.5, y: 0.5 })];
    const result = evaluatePlacement("circle", 0.5, 0.5, unplaced, 0.1);
    expect(result.roundComplete).toBe(true);
    expect(result.unplaced).toHaveLength(0);
  });

  it("signals round not complete when shapes remain", () => {
    const unplaced = [
      shape({ type: "circle", x: 0.3, y: 0.3 }),
      shape({ type: "square", x: 0.7, y: 0.7 }),
    ];
    const result = evaluatePlacement("circle", 0.3, 0.3, unplaced, 0.1);
    expect(result.matched).toBe(true);
    expect(result.roundComplete).toBe(false);
    expect(result.unplaced).toHaveLength(1);
  });

  it("handles empty unplaced array", () => {
    const result = evaluatePlacement("circle", 0.5, 0.5, [], 0.1);
    expect(result.matched).toBe(false);
    expect(result.placedShape).toBeNull();
    expect(result.roundComplete).toBe(false);
  });

  it("matches within threshold boundary", () => {
    const unplaced = [shape({ type: "circle", x: 0.5, y: 0.5 })];
    const result = evaluatePlacement("circle", 0.55, 0.5, unplaced, 0.06);
    expect(result.matched).toBe(true);
  });

  it("fails just beyond threshold", () => {
    const unplaced = [shape({ type: "circle", x: 0.5, y: 0.5 })];
    const result = evaluatePlacement("circle", 0.57, 0.5, unplaced, 0.06);
    expect(result.matched).toBe(false);
  });
});

describe("calculateStars", () => {
  it("returns 0 for score below 60% of goal", () => {
    expect(calculateStars(3, 10)).toBe(0);
  });

  it("returns 1 at exactly 60% of goal", () => {
    expect(calculateStars(6, 10)).toBe(1);
  });

  it("returns 1 for score between 60% and goal", () => {
    expect(calculateStars(8, 10)).toBe(1);
  });

  it("returns 2 at exactly goal", () => {
    expect(calculateStars(10, 10)).toBe(2);
  });

  it("returns 2 for score above goal but below 140%", () => {
    expect(calculateStars(12, 10)).toBe(2);
  });

  it("returns 3 at exactly 140% of goal", () => {
    expect(calculateStars(14, 10)).toBe(3);
  });

  it("returns 3 for score above 140% of goal", () => {
    expect(calculateStars(20, 10)).toBe(3);
  });

  it("handles goalScore of 0 without division error", () => {
    expect(calculateStars(0, 0)).toBe(3);
  });
});

describe("getTemplates", () => {
  it("returns 10 templates", () => {
    const templates = getTemplates();
    expect(templates).toHaveLength(10);
  });

  it("each template has at least 5 shapes", () => {
    const templates = getTemplates();
    for (const t of templates) {
      expect(t.shapes.length).toBeGreaterThanOrEqual(5);
    }
  });

  it("each shape has valid fields", () => {
    const templates = getTemplates();
    const validTypes: ShapeType[] = ["circle", "square", "triangle", "rectangle", "diamond"];
    for (const t of templates) {
      for (const s of t.shapes) {
        expect(validTypes).toContain(s.type);
        expect(s.color).toMatch(/^#[0-9a-f]{3}([0-9a-f]{3})?$/);
        expect(s.x).toBeGreaterThanOrEqual(0);
        expect(s.x).toBeLessThanOrEqual(1);
        expect(s.y).toBeGreaterThanOrEqual(0);
        expect(s.y).toBeLessThanOrEqual(1);
        expect(s.w).toBeGreaterThan(0);
        expect(s.h).toBeGreaterThan(0);
      }
    }
  });
});
