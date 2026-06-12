// @vitest-environment jsdom

import { describe, expect, test } from "vitest";
import { renderGameHeader, updateGameHeaderMeta, updateGameHeaderAction } from "@shared/ui/gameHeader";

describe("renderGameHeader", () => {
  test("renders title, back link, and structure", () => {
    const root = document.createElement("div");
    renderGameHeader(root, { title: "My Game", backHref: "/", backLabel: "Home" });

    expect(root.querySelector(".game-header")).toBeTruthy();
    const titleEl = root.querySelector(".game-header-title");
    expect(titleEl?.textContent).toBe("My Game");
    const backLink = root.querySelector(".game-header-back");
    expect(backLink?.getAttribute("href")).toBe("/");
    expect(backLink?.getAttribute("aria-label")).toBe("Home");
  });

  test("renders meta pills", () => {
    const root = document.createElement("div");
    renderGameHeader(root, {
      title: "Game",
      backHref: "/",
      backLabel: "Back",
      leftMeta: [
        { id: "score", text: "Score: 42" },
        { id: "lives", text: "3", ariaLabel: "3 lives remaining" }
      ]
    });

    const pills = root.querySelectorAll(".game-header-pill");
    expect(pills).toHaveLength(2);
    expect(pills[0]?.textContent).toBe("Score: 42");
    expect(pills[0]?.getAttribute("data-meta-id")).toBe("score");
    expect(pills[1]?.getAttribute("aria-label")).toBe("3 lives remaining");
  });

  test("renders action buttons with labels", () => {
    const root = document.createElement("div");
    renderGameHeader(root, {
      title: "Game",
      backHref: "/",
      backLabel: "Back",
      rightActions: [
        { id: "settings", label: "Settings" },
        { id: "undo", label: "Undo", disabled: true }
      ]
    });

    const btns = root.querySelectorAll(".game-header-action");
    expect(btns).toHaveLength(2);
    expect(btns[0]?.textContent).toBe("Settings");
    expect(btns[1]?.getAttribute("disabled")).not.toBeNull();
  });

  test("renders action buttons with icons", () => {
    const root = document.createElement("div");
    renderGameHeader(root, {
      title: "Game",
      backHref: "/",
      backLabel: "Back",
      rightActions: [
        { id: "sound", label: "Toggle Sound", icon: "<svg>test</svg>", pressed: true }
      ]
    });

    const btn = root.querySelector<HTMLButtonElement>(".game-header-action");
    expect(btn?.innerHTML).toBe("<svg>test</svg>");
    expect(btn?.getAttribute("aria-label")).toBe("Toggle Sound");
    expect(btn?.getAttribute("aria-pressed")).toBe("true");
    expect(btn?.classList.contains("icon-btn")).toBe(true);
  });

  test("escapes HTML in title and labels", () => {
    const root = document.createElement("div");
    renderGameHeader(root, {
      title: "<script>alert('xss')</script>",
      backHref: "/",
      backLabel: "Back",
      leftMeta: [{ id: "score", text: "<b>bold</b>" }],
      rightActions: [{ id: "foo", label: "<i>bar</i>" }]
    });

    expect(root.querySelector(".game-header-title")?.innerHTML).not.toContain("<script>");
    expect(root.querySelector(".game-header-title")?.innerHTML).toContain("&lt;script&gt;");
    expect(root.querySelector(".game-header-pill")?.innerHTML).not.toContain("<b>");
    expect(root.querySelector(".game-header-pill")?.innerHTML).toContain("&lt;b&gt;");
    const actionBtn = root.querySelector<HTMLButtonElement>(".game-header-action");
    expect(actionBtn?.textContent).toBe("<i>bar</i>");
  });

  test("renders with default aria-label on the header section", () => {
    const root = document.createElement("div");
    renderGameHeader(root, { title: "Game", backHref: "/", backLabel: "Back" });

    const section = root.querySelector(".game-header");
    expect(section?.getAttribute("aria-label")).toBe("game header");
  });

  test("handles empty meta and actions gracefully", () => {
    const root = document.createElement("div");
    renderGameHeader(root, { title: "Game", backHref: "/", backLabel: "Back" });

    expect(root.querySelector(".game-header-meta")?.children).toHaveLength(0);
    expect(root.querySelector(".game-header-actions")?.children).toHaveLength(0);
  });
});

describe("updateGameHeaderMeta", () => {
  test("updates text of existing meta pill", () => {
    const root = document.createElement("div");
    renderGameHeader(root, {
      title: "Game",
      backHref: "/",
      backLabel: "Back",
      leftMeta: [{ id: "score", text: "Score: 0" }]
    });

    updateGameHeaderMeta(root, "score", "Score: 10");
    expect(root.querySelector("[data-meta-id='score']")?.textContent).toBe("Score: 10");
  });

  test("no-ops when id does not exist", () => {
    const root = document.createElement("div");
    renderGameHeader(root, { title: "Game", backHref: "/", backLabel: "Back" });

    expect(() => updateGameHeaderMeta(root, "nonexistent", "value")).not.toThrow();
  });
});

describe("updateGameHeaderAction", () => {
  test("updates label text", () => {
    const root = document.createElement("div");
    renderGameHeader(root, {
      title: "Game",
      backHref: "/",
      backLabel: "Back",
      rightActions: [{ id: "sound", label: "Sound On" }]
    });

    updateGameHeaderAction(root, "sound", { label: "Sound Off" });
    const btn = root.querySelector<HTMLButtonElement>("#sound");
    expect(btn?.textContent).toBe("Sound Off");
    expect(btn?.getAttribute("aria-label")).toBeNull();
    expect(btn?.classList.contains("icon-btn")).toBe(false);
  });

  test("switches from label to icon", () => {
    const root = document.createElement("div");
    renderGameHeader(root, {
      title: "Game",
      backHref: "/",
      backLabel: "Back",
      rightActions: [{ id: "sound", label: "Sound" }]
    });

    updateGameHeaderAction(root, "sound", { icon: "<svg>speaker</svg>", label: "Toggle Sound" });
    const btn = root.querySelector<HTMLButtonElement>("#sound");
    expect(btn?.innerHTML).toBe("<svg>speaker</svg>");
    expect(btn?.getAttribute("aria-label")).toBe("Toggle Sound");
    expect(btn?.classList.contains("icon-btn")).toBe(true);
  });

  test("updates pressed and disabled states", () => {
    const root = document.createElement("div");
    renderGameHeader(root, {
      title: "Game",
      backHref: "/",
      backLabel: "Back",
      rightActions: [{ id: "sound", label: "Sound", pressed: false }]
    });

    updateGameHeaderAction(root, "sound", { pressed: true, disabled: true });
    const btn = root.querySelector<HTMLButtonElement>("#sound");
    expect(btn?.getAttribute("aria-pressed")).toBe("true");
    expect(btn?.disabled).toBe(true);
  });

  test("no-ops when id does not exist", () => {
    const root = document.createElement("div");
    renderGameHeader(root, { title: "Game", backHref: "/", backLabel: "Back" });

    expect(() => updateGameHeaderAction(root, "nonexistent", { label: "x" })).not.toThrow();
  });
});
