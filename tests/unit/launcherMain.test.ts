// @vitest-environment jsdom

import { vi, describe, expect, test } from "vitest";

vi.hoisted(() => {
  const div = document.createElement("div");
  div.id = "app";
  document.body.appendChild(div);
  const store: Record<string, string> = {};
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => { store[key] = value; },
      removeItem: (key: string) => { delete store[key]; },
      clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
      length: 0,
      key: () => null,
    },
    writable: true,
  });
});

import { isLocalAssetPath, resolveGameIcon, iconMarkup, buildCardHtml } from "@platform/main";
import type { GameManifest } from "@shared/types/game";

const makeGame = (overrides: Partial<GameManifest> = {}): GameManifest => ({
  id: "test-game",
  slug: "test-game",
  path: "/games/test-game",
  status: "playable",
  title: { en: "Test Game", es: "Juego de Prueba" },
  description: { en: "A test game", es: "Un juego de prueba" },
  cardIcon: "/assets/games/test.svg",
  ageBands: ["4-5", "6-7"],
  skills: ["numeracy", "memory"],
  learningGoals: [],
  difficultyPresets: {
    "4-5": { dropCooldownMs: 2000, goalScore: 5, maxObjectsHint: 3 },
    "6-7": { dropCooldownMs: 1500, goalScore: 10, maxObjectsHint: 5 },
    "8": { dropCooldownMs: 1000, goalScore: 15, maxObjectsHint: 7 }
  },
  ...overrides
});

describe("isLocalAssetPath", () => {
  test("returns true for /assets/ path", () => {
    expect(isLocalAssetPath("/assets/games/test.svg")).toBe(true);
  });

  test("returns false for non-asset path", () => {
    expect(isLocalAssetPath("https://cdn.example.com/icon.svg")).toBe(false);
  });

  test("returns false for empty string", () => {
    expect(isLocalAssetPath("")).toBe(false);
  });

  test("returns false for undefined", () => {
    expect(isLocalAssetPath(undefined)).toBe(false);
  });

  test("returns false for relative path without /assets/", () => {
    expect(isLocalAssetPath("images/icon.svg")).toBe(false);
  });
});

describe("resolveGameIcon", () => {
  test("returns cardIcon when it is a local asset path", () => {
    const game = makeGame({ cardIcon: "/assets/games/custom.svg" });
    expect(resolveGameIcon(game)).toBe("/assets/games/custom.svg");
  });

  test("returns cardIconFallback when cardIcon is not local", () => {
    const game = makeGame({
      cardIcon: "https://cdn.example.com/icon.svg",
      cardIconFallback: "/assets/games/fallback.svg"
    });
    expect(resolveGameIcon(game)).toBe("/assets/games/fallback.svg");
  });

  test("returns fallback icon when neither cardIcon nor fallback is local", () => {
    const game = makeGame({
      cardIcon: "https://cdn.example.com/icon.svg",
      cardIconFallback: "https://cdn.example.com/fallback.svg"
    });
    expect(resolveGameIcon(game)).toBe("/assets/icon.svg");
  });

  test("returns fallback icon when cardIconFallback is undefined and cardIcon is not local", () => {
    const game = makeGame({
      cardIcon: "https://cdn.example.com/icon.svg",
      cardIconFallback: undefined
    });
    expect(resolveGameIcon(game)).toBe("/assets/icon.svg");
  });

  test("prioritizes cardIcon over cardIconFallback when both are local", () => {
    const game = makeGame({
      cardIcon: "/assets/games/primary.svg",
      cardIconFallback: "/assets/games/fallback.svg"
    });
    expect(resolveGameIcon(game)).toBe("/assets/games/primary.svg");
  });
});

describe("iconMarkup", () => {
  test("produces img tag with correct src and data-fallback", () => {
    const game = makeGame({ cardIcon: "/assets/games/test.svg" });
    const html = iconMarkup(game);
    expect(html).toContain('<img class="card-icon-img"');
    expect(html).toContain('src="/assets/games/test.svg"');
    expect(html).toContain('data-fallback="/assets/icon.svg"');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('loading="lazy"');
  });

  test("uses resolved fallback icon path in src when primary is not local", () => {
    const game = makeGame({
      cardIcon: "https://cdn.example.com/icon.svg",
      cardIconFallback: "/assets/games/fallback.svg"
    });
    const html = iconMarkup(game);
    expect(html).toContain('src="/assets/games/fallback.svg"');
  });
});

describe("buildCardHtml", () => {
  const baseLabels = {
    ctaText: "Play",
    statusText: "Ready",
    ageTagsHtml: '<span class="tag">Ages 4-5</span><span class="tag">Ages 6-7</span>',
    skillTagsHtml: '<span class="tag">Numeracy</span><span class="tag">Memory</span>',
    localeTitle: "Test Game",
    localeDescription: "A test game",
  };

  test("renders playable card with correct structure", () => {
    const game = makeGame({ status: "playable" });
    const html = buildCardHtml(game, baseLabels);

    expect(html).toContain('class="panel game-card "');
    expect(html).toContain('data-game-id="test-game"');
    expect(html).toContain('href="/games/test-game"');
    expect(html).not.toContain("coming-soon");
    expect(html).not.toContain("status-placeholder");
    expect(html).toContain("Ready");
    expect(html).toContain(">Play<");
    expect(html).not.toContain("disabled");
  });

  test("renders placeholder card with coming-soon class and disabled button", () => {
    const game = makeGame({ status: "placeholder" });
    const labels = { ...baseLabels, ctaText: "Coming Soon", statusText: "In Progress" };
    const html = buildCardHtml(game, labels);

    expect(html).toContain("coming-soon");
    expect(html).toContain("status-placeholder");
    expect(html).toContain("tabindex=\"0\"");
    expect(html).toContain(">Coming Soon<");
    expect(html).toContain("disabled");
  });

  test("renders age and skill tag rows", () => {
    const game = makeGame();
    const html = buildCardHtml(game, baseLabels);

    expect(html).toContain("Ages 4-5");
    expect(html).toContain("Ages 6-7");
    expect(html).toContain("Numeracy");
    expect(html).toContain("Memory");
  });

  test("escapes HTML in title and description", () => {
    const game = makeGame();
    const labels = {
      ...baseLabels,
      localeTitle: "<script>alert('xss')</script>",
      localeDescription: 'Test with "quotes" & ampersands'
    };
    const html = buildCardHtml(game, labels);

    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("&amp;");
    expect(html).toContain("&quot;");
  });

  test("includes icon markup inside card", () => {
    const game = makeGame({ cardIcon: "/assets/games/custom.svg" });
    const html = buildCardHtml(game, baseLabels);

    expect(html).toContain('src="/assets/games/custom.svg"');
    expect(html).toContain("card-icon-img");
  });
});
