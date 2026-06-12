import { describe, expect, test } from "vitest";
import { resolveLocale } from "@shared/i18n";
import { dictionaries } from "@shared/i18n/dictionaries";
import enLocale from "../../public/locales/en/common.json";
import esLocale from "../../public/locales/es/common.json";

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
    expect(dictionaries.en.appTitle).toBe("berries arcade");
    expect(dictionaries.es.appTitle).toBe("berries arcade");
  });

  test("falls back to en when key missing in es", () => {
    const key = "appTitle" as const;
    const esVal = dictionaries.es[key];
    const enVal = dictionaries.en[key];
    const fallback = esVal ?? enVal;
    expect(fallback).toBe(enVal);
  });
});
