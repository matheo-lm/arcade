// @vitest-environment jsdom

import { describe, expect, test, vi } from "vitest";
import { renderSettingsMenu, bindSettingsMenuEvents } from "@shared/ui/settingsMenu";
import type { SettingsMenuConfig, SettingsMenuHandlers } from "@shared/ui/settingsMenu";

const baseConfig: SettingsMenuConfig = {
  idPrefix: "game",
  isOpen: false,
  locale: "en",
  themePreference: "system",
  muted: false,
  labels: {
    settingsLabel: "Settings",
    settingsOpen: "Open settings",
    settingsClose: "Close settings",
    themeLabel: "Theme",
    themeSystem: "System",
    themeLight: "Light",
    themeDark: "Dark",
    languageLabel: "Language",
    audioLabel: "Sound",
    soundOn: "Sound On",
    soundOff: "Sound Off",
  },
};

const baseHandlers: SettingsMenuHandlers = {
  onOpenChange: vi.fn(),
  onThemeChange: vi.fn(),
  onLocaleChange: vi.fn(),
  onToggleMuted: vi.fn(),
};

describe("renderSettingsMenu", () => {
  test("renders toggle button with correct aria attributes", () => {
    const root = document.createElement("div");
    renderSettingsMenu(root, baseConfig);

    const toggle = root.querySelector<HTMLButtonElement>("#gameSettingsMenuBtn");
    expect(toggle).toBeTruthy();
    expect(toggle?.getAttribute("aria-label")).toBe("Open settings");
    expect(toggle?.getAttribute("aria-expanded")).toBe("false");
    expect(toggle?.getAttribute("aria-controls")).toBe("gameSettingsPanel");
  });

  test("renders panel hidden when closed", () => {
    const root = document.createElement("div");
    renderSettingsMenu(root, baseConfig);

    const panel = root.querySelector("#gameSettingsPanel");
    expect(panel?.getAttribute("aria-hidden")).toBe("true");
    expect(panel?.hasAttribute("hidden")).toBe(true);
    expect(panel?.classList.contains("open")).toBe(false);
  });

  test("renders panel visible when open", () => {
    const root = document.createElement("div");
    renderSettingsMenu(root, { ...baseConfig, isOpen: true });

    const panel = root.querySelector("#gameSettingsPanel");
    expect(panel?.getAttribute("aria-hidden")).toBe("false");
    expect(panel?.hasAttribute("hidden")).toBe(false);
    expect(panel?.classList.contains("open")).toBe(true);
  });

  test("renders title", () => {
    const root = document.createElement("div");
    renderSettingsMenu(root, baseConfig);

    expect(root.querySelector("h2")?.textContent).toBe("Settings");
  });

  test("renders theme select in default mode", () => {
    const root = document.createElement("div");
    renderSettingsMenu(root, baseConfig);

    expect(root.querySelector("#gameThemeSelect")).toBeTruthy();
    expect(root.querySelector("#gameThemeSystemBtn")).toBeFalsy();
  });

  test("renders theme icons in icons mode", () => {
    const root = document.createElement("div");
    renderSettingsMenu(root, { ...baseConfig, themeControlMode: "icons" });

    expect(root.querySelector("#gameThemeSelect")).toBeFalsy();
    expect(root.querySelector("#gameThemeSystemBtn")).toBeTruthy();
    expect(root.querySelector("#gameThemeLightBtn")).toBeTruthy();
    expect(root.querySelector("#gameThemeDarkBtn")).toBeTruthy();
  });

  test("renders language switch with correct locale selected", () => {
    const root = document.createElement("div");
    renderSettingsMenu(root, baseConfig);

    const enBtn = root.querySelector<HTMLButtonElement>("#gameLangEn");
    const esBtn = root.querySelector<HTMLButtonElement>("#gameLangEs");
    expect(enBtn?.disabled).toBe(true);
    expect(esBtn?.disabled).toBe(false);
  });

  test("renders sound button with correct label", () => {
    const root = document.createElement("div");
    renderSettingsMenu(root, baseConfig);

    expect(root.querySelector("#gameSoundBtn")?.textContent).toBe("Sound On");
  });

  test("renders sound button with muted label", () => {
    const root = document.createElement("div");
    renderSettingsMenu(root, { ...baseConfig, muted: true });

    expect(root.querySelector("#gameSoundBtn")?.textContent).toBe("Sound Off");
  });

  test("renders restart button only when label provided", () => {
    const root = document.createElement("div");
    renderSettingsMenu(root, {
      ...baseConfig,
      labels: { ...baseConfig.labels, restartLabel: "Restart" },
    });

    expect(root.querySelector("#gameRestartBtn")?.textContent).toBe("Restart");
  });

  test("does not render restart button when label omitted", () => {
    const root = document.createElement("div");
    renderSettingsMenu(root, baseConfig);

    expect(root.querySelector("#gameRestartBtn")).toBeFalsy();
  });

  test("renders immersive button only when label provided", () => {
    const root = document.createElement("div");
    renderSettingsMenu(root, {
      ...baseConfig,
      labels: { ...baseConfig.labels, fullscreenLabel: "Fullscreen" },
    });

    expect(root.querySelector("#gameImmersiveBtn")?.textContent).toBe("Fullscreen");
  });

  test("renders create profile section when enabled", () => {
    const root = document.createElement("div");
    renderSettingsMenu(root, {
      ...baseConfig,
      includeCreateProfile: true,
      labels: { ...baseConfig.labels, createProfileLabel: "New Player" },
    });

    expect(root.querySelector("#gameCreateProfileBtn")?.textContent).toBe("New Player");
  });

  test("escapes HTML in labels", () => {
    const root = document.createElement("div");
    renderSettingsMenu(root, {
      ...baseConfig,
      labels: {
        ...baseConfig.labels,
        settingsLabel: "<script>evil</script>",
      },
    });

    expect(root.querySelector("h2")?.innerHTML).not.toContain("<script>");
    expect(root.querySelector("h2")?.innerHTML).toContain("&lt;script&gt;");
  });

  test("respects custom idPrefix", () => {
    const root = document.createElement("div");
    renderSettingsMenu(root, { ...baseConfig, idPrefix: "launcher" });

    expect(root.querySelector("#launcherSettingsMenuBtn")).toBeTruthy();
    expect(root.querySelector("#gameSettingsMenuBtn")).toBeFalsy();
  });
});

describe("bindSettingsMenuEvents", () => {
  test("toggle button calls onOpenChange", () => {
    const root = document.createElement("div");
    renderSettingsMenu(root, baseConfig);
    const handlers = { ...baseHandlers, onOpenChange: vi.fn() };
    bindSettingsMenuEvents(root, baseConfig, handlers);

    root.querySelector<HTMLButtonElement>("#gameSettingsMenuBtn")?.click();
    expect(handlers.onOpenChange).toHaveBeenCalledWith(true);
  });

  test("escape key calls onOpenChange and focuses toggle", () => {
    const root = document.createElement("div");
    document.body.appendChild(root);
    renderSettingsMenu(root, { ...baseConfig, isOpen: true });
    const handlers = { ...baseHandlers, onOpenChange: vi.fn() };
    bindSettingsMenuEvents(root, { ...baseConfig, isOpen: true }, handlers);

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(handlers.onOpenChange).toHaveBeenCalledWith(false);
    expect(document.activeElement?.id).toBe("gameSettingsMenuBtn");
    document.body.removeChild(root);
  });

  test("outside click calls onOpenChange", () => {
    const root = document.createElement("div");
    renderSettingsMenu(root, { ...baseConfig, isOpen: true });
    const handlers = { ...baseHandlers, onOpenChange: vi.fn() };
    bindSettingsMenuEvents(root, { ...baseConfig, isOpen: true }, handlers);

    document.body.click();
    expect(handlers.onOpenChange).toHaveBeenCalledWith(false);
  });

  test("click inside panel does not call onOpenChange", () => {
    const root = document.createElement("div");
    renderSettingsMenu(root, { ...baseConfig, isOpen: true });
    const handlers = { ...baseHandlers, onOpenChange: vi.fn() };
    bindSettingsMenuEvents(root, { ...baseConfig, isOpen: true }, handlers);

    root.querySelector<HTMLElement>("#gameSettingsPanel")?.click();
    expect(handlers.onOpenChange).not.toHaveBeenCalled();
  });

  test("theme select calls onThemeChange", () => {
    const root = document.createElement("div");
    renderSettingsMenu(root, baseConfig);
    const handlers = { ...baseHandlers, onThemeChange: vi.fn() };
    bindSettingsMenuEvents(root, baseConfig, handlers);

    const select = root.querySelector<HTMLSelectElement>("#gameThemeSelect")!;
    select.value = "dark";
    select.dispatchEvent(new Event("change"));
    expect(handlers.onThemeChange).toHaveBeenCalledWith("dark");
  });

  test("theme icon buttons call onThemeChange with correct value", () => {
    const root = document.createElement("div");
    renderSettingsMenu(root, { ...baseConfig, themeControlMode: "icons", themePreference: "system" });
    const handlers = { ...baseHandlers, onThemeChange: vi.fn() };
    bindSettingsMenuEvents(root, { ...baseConfig, themeControlMode: "icons", themePreference: "system" }, handlers);

    root.querySelector<HTMLButtonElement>("#gameThemeDarkBtn")?.click();
    expect(handlers.onThemeChange).toHaveBeenCalledWith("dark");

    root.querySelector<HTMLButtonElement>("#gameThemeLightBtn")?.click();
    expect(handlers.onThemeChange).toHaveBeenCalledWith("light");
  });

  test("language buttons call onLocaleChange", () => {
    const root = document.createElement("div");
    renderSettingsMenu(root, baseConfig);
    const handlers = { ...baseHandlers, onLocaleChange: vi.fn() };
    bindSettingsMenuEvents(root, baseConfig, handlers);

    root.querySelector<HTMLButtonElement>("#gameLangEs")?.click();
    expect(handlers.onLocaleChange).toHaveBeenCalledWith("es");
  });

  test("sound button calls onToggleMuted", () => {
    const root = document.createElement("div");
    renderSettingsMenu(root, baseConfig);
    const handlers = { ...baseHandlers, onToggleMuted: vi.fn() };
    bindSettingsMenuEvents(root, baseConfig, handlers);

    root.querySelector<HTMLButtonElement>("#gameSoundBtn")?.click();
    expect(handlers.onToggleMuted).toHaveBeenCalled();
  });

  test("restart button calls onRestart", () => {
    const root = document.createElement("div");
    const config = {
      ...baseConfig,
      labels: { ...baseConfig.labels, restartLabel: "Restart" },
    };
    renderSettingsMenu(root, config);
    const handlers = { ...baseHandlers, onRestart: vi.fn() };
    bindSettingsMenuEvents(root, config, handlers);

    root.querySelector<HTMLButtonElement>("#gameRestartBtn")?.click();
    expect(handlers.onRestart).toHaveBeenCalled();
  });

  test("immersive button calls onToggleImmersive", () => {
    const root = document.createElement("div");
    const config = {
      ...baseConfig,
      labels: { ...baseConfig.labels, fullscreenLabel: "Fullscreen" },
    };
    renderSettingsMenu(root, config);
    const handlers = { ...baseHandlers, onToggleImmersive: vi.fn() };
    bindSettingsMenuEvents(root, config, handlers);

    root.querySelector<HTMLButtonElement>("#gameImmersiveBtn")?.click();
    expect(handlers.onToggleImmersive).toHaveBeenCalled();
  });

  test("create profile button calls onCreateProfile", () => {
    const root = document.createElement("div");
    const config = {
      ...baseConfig,
      includeCreateProfile: true,
      labels: { ...baseConfig.labels, createProfileLabel: "New Player" },
    };
    renderSettingsMenu(root, config);
    const handlers = { ...baseHandlers, onCreateProfile: vi.fn() };
    bindSettingsMenuEvents(root, config, handlers);

    root.querySelector<HTMLButtonElement>("#gameCreateProfileBtn")?.click();
    expect(handlers.onCreateProfile).toHaveBeenCalled();
  });

  test("cleanup removes event listeners", () => {
    const root = document.createElement("div");
    renderSettingsMenu(root, { ...baseConfig, isOpen: true });
    const handlers = { ...baseHandlers, onOpenChange: vi.fn() };
    const cleanup = bindSettingsMenuEvents(root, { ...baseConfig, isOpen: true }, handlers);

    cleanup();

    document.body.click();
    expect(handlers.onOpenChange).not.toHaveBeenCalled();
  });
});
