// @vitest-environment jsdom

import { describe, expect, test, vi, beforeEach, afterEach } from "vitest";
import { resolveTheme, applyTheme, watchSystemTheme } from "@shared/ui/theme";

describe("resolveTheme", () => {
  test("returns light for light preference", () => {
    expect(resolveTheme("light")).toBe("light");
  });

  test("returns dark for dark preference", () => {
    expect(resolveTheme("dark")).toBe("dark");
  });

  test("returns light when system preference is light", () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      media: "",
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
    }));
    expect(resolveTheme("system")).toBe("light");
  });

  test("returns dark when system preference is dark", () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: "",
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
    }));
    expect(resolveTheme("system")).toBe("dark");
  });
});

describe("applyTheme", () => {
  beforeEach(() => {
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.removeAttribute("data-theme-preference");
  });

  test("sets data-theme and data-theme-preference attributes", () => {
    applyTheme("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(document.documentElement.getAttribute("data-theme-preference")).toBe("dark");
  });

  test("returns the resolved theme mode", () => {
    expect(applyTheme("light")).toBe("light");
    expect(applyTheme("dark")).toBe("dark");
  });

  test("resolves system to light or dark using matchMedia", () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: "",
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
    }));
    const mode = applyTheme("system");
    expect(mode).toBe("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(document.documentElement.getAttribute("data-theme-preference")).toBe("system");
  });
});

describe("watchSystemTheme", () => {
  let handler: () => void;
  let removeHandler: () => void;
  let matchMediaMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    handler = () => undefined;
    removeHandler = () => undefined;
    matchMediaMock = vi.fn().mockImplementation(() => ({
      matches: false,
      media: "",
      addEventListener: (_event: string, fn: () => void) => {
        handler = fn;
      },
      removeEventListener: (_event: string, fn: () => void) => {
        if (fn === handler) removeHandler();
      },
      addListener: vi.fn(),
      removeListener: vi.fn(),
    }));
    window.matchMedia = matchMediaMock;
  });

  afterEach(() => {
    handler = () => undefined;
    removeHandler = () => undefined;
  });

  test("returns noop when preference is not system", () => {
    const cleanup = watchSystemTheme("light", vi.fn());
    expect(typeof cleanup).toBe("function");
    cleanup();
    expect(window.matchMedia).not.toHaveBeenCalled();
  });

  test("attaches change listener when preference is system", () => {
    watchSystemTheme("system", vi.fn());
    expect(window.matchMedia).toHaveBeenCalledWith("(prefers-color-scheme: dark)");
  });

  test("calls onChange when system theme changes", () => {
    const onChange = vi.fn();
    watchSystemTheme("system", onChange);

    expect(handler).toBeDefined();
    handler();
    expect(onChange).toHaveBeenCalled();
  });

  test("cleanup prevents further onChange calls", () => {
    const onChange = vi.fn();
    const cleanup = watchSystemTheme("system", onChange);

    let unregistered = false;
    removeHandler = () => {
      unregistered = true;
    };
    cleanup();

    expect(unregistered).toBe(true);
  });
});
