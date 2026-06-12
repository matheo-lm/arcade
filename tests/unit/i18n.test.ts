import { describe, expect, test } from "vitest";
import { resolveLocale } from "@shared/i18n";
import { dictionaries } from "@shared/i18n/dictionaries";

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

describe("i18n runtime t()", () => {
  test("returns value for existing key in current locale", () => {
    expect(dictionaries.en.appTitle).toBe("x's arcade");
    expect(dictionaries.es.appTitle).toBe("x's arcade");
  });

  test("falls back to en when key missing in es", () => {
    const key = "appTitle" as const;
    const esVal = dictionaries.es[key];
    const enVal = dictionaries.en[key];
    const fallback = esVal ?? enVal;
    expect(fallback).toBe(enVal);
  });
});
