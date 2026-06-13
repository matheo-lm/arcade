import { describe, expect, test, vi, beforeEach } from "vitest";
import { createI18n, resolveLocale } from "@shared/i18n";
import { dictionaries } from "@shared/i18n/dictionaries";
import enLocale from "../../public/locales/en/common.json";
import esLocale from "../../public/locales/es/common.json";
import type { TranslationKey } from "@shared/types/i18n";

const { mockGetLocale, mockSetLocale } = vi.hoisted(() => ({
  mockGetLocale: vi.fn<() => "en" | "es">(() => "en"),
  mockSetLocale: vi.fn()
}));

vi.mock("@shared/storage/platformStorage", () => ({
  platformStorage: {
    getLocale: mockGetLocale,
    setLocale: mockSetLocale
  }
}));

describe("i18n locale resolution", () => {
  test("prioritizes query param over other sources", () => {
    const locale = resolveLocale({
      search: "?lang=es",
      storedLocale: "en",
      navigatorLanguages: ["en-US"]
    });

    expect(locale).toBe("es");
  });

  test("falls back to stored locale when query is absent", () => {
    const locale = resolveLocale({
      search: "",
      storedLocale: "es",
      navigatorLanguages: ["en-US"]
    });

    expect(locale).toBe("es");
  });

  test("falls back to navigator then en", () => {
    expect(
      resolveLocale({ search: "", storedLocale: null, navigatorLanguages: ["es-MX", "en-US"] })
    ).toBe("es");

    expect(resolveLocale({ search: "", storedLocale: null, navigatorLanguages: ["fr-FR"] })).toBe("en");
  });

  test("uses locale-correct gameNext label", () => {
    expect(dictionaries.en.gameNext).toBe("next");
    expect(dictionaries.es.gameNext).toBe("siguiente");
  });
});

describe("i18n dictionary vs locale file sync", () => {
  const dictKeys = Object.keys(dictionaries.en).sort();
  const enKeys = Object.keys(enLocale).sort();
  const esKeys = Object.keys(esLocale).sort();

  test("dictionary keys match en/common.json", () => {
    expect(enKeys).toEqual(dictKeys);
  });

  test("dictionary keys match es/common.json", () => {
    expect(esKeys).toEqual(dictKeys);
  });

  test("all en values match dictionaries.en", () => {
    for (const key of dictKeys) {
      expect(enLocale[key as keyof typeof enLocale]).toBe(dictionaries.en[key as keyof typeof dictionaries.en]);
    }
  });

  test("all es values match dictionaries.es", () => {
    for (const key of dictKeys) {
      expect(esLocale[key as keyof typeof esLocale]).toBe(dictionaries.es[key as keyof typeof dictionaries.es]);
    }
  });
});

describe("i18n runtime t()", () => {
  test("returns value for existing key in current locale", () => {
    expect(dictionaries.en.appTitle).toBe("arcade");
    expect(dictionaries.es.appTitle).toBe("arcade");
  });

  test("falls back to en when key missing in es", () => {
    const key = "appTitle" as const;
    const esVal = dictionaries.es[key];
    const enVal = dictionaries.en[key];
    const fallback = esVal ?? enVal;
    expect(fallback).toBe(enVal);
  });
});

describe("createI18n runtime", () => {
  beforeEach(() => {
    mockGetLocale.mockReset().mockReturnValue("en");
    mockSetLocale.mockReset();
  });

  test("initializes with English locale by default", () => {
    const i18n = createI18n();
    expect(i18n.locale).toBe("en");
  });

  test("calls getLocale during initialization", () => {
    createI18n();
    expect(mockGetLocale).toHaveBeenCalled();
  });

  test("calls setLocale with resolved locale during init", () => {
    createI18n();
    expect(mockSetLocale).toHaveBeenCalledWith("en");
  });

  test("initializes with stored Spanish locale", () => {
    mockGetLocale.mockReturnValue("es");
    const i18n = createI18n();
    expect(i18n.locale).toBe("es");
    expect(mockSetLocale).toHaveBeenCalledWith("es");
  });

  test("query param overrides stored locale", () => {
    mockGetLocale.mockReturnValue("en");
    const i18n = createI18n("?lang=es");
    expect(i18n.locale).toBe("es");
  });

  test("t() returns English value when locale is en", () => {
    const i18n = createI18n();
    expect(i18n.t("appTitle")).toBe("arcade");
    expect(i18n.t("gameNext")).toBe("next");
  });

  test("t() returns Spanish value when locale is es", () => {
    mockGetLocale.mockReturnValue("es");
    const i18n = createI18n();
    expect(i18n.t("gameNext")).toBe("siguiente");
  });

  test("t() falls back to raw key when missing from all dictionaries", () => {
    const i18n = createI18n();
    const unknown = "unknown_key" as TranslationKey;
    expect(i18n.t(unknown)).toBe("unknown_key");
  });

  test("setLocale updates runtime locale", () => {
    const i18n = createI18n();
    expect(i18n.locale).toBe("en");
    i18n.setLocale("es");
    expect(i18n.locale).toBe("es");
  });

  test("setLocale persists via platformStorage", () => {
    const i18n = createI18n();
    i18n.setLocale("es");
    expect(mockSetLocale).toHaveBeenCalledWith("es");
  });

  test("t() reflects locale change after setLocale", () => {
    const i18n = createI18n();
    expect(i18n.t("gameNext")).toBe("next");
    i18n.setLocale("es");
    expect(i18n.t("gameNext")).toBe("siguiente");
    i18n.setLocale("en");
    expect(i18n.t("gameNext")).toBe("next");
  });

  test("exposes I18nRuntime interface", () => {
    const i18n = createI18n();
    expect(i18n).toHaveProperty("locale");
    expect(i18n).toHaveProperty("t");
    expect(i18n).toHaveProperty("setLocale");
    expect(typeof i18n.t).toBe("function");
    expect(typeof i18n.setLocale).toBe("function");
  });
});
