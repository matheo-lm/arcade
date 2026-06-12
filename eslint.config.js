import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" }],
      "no-console": "error",
      "no-useless-escape": "warn"
    }
  },
  {
    files: ["public/sw.js"],
    languageOptions: { globals: { URL: "readonly", self: "readonly", caches: "readonly", fetch: "readonly" } }
  },
  {
    ignores: ["dist/", "output/", "tmp/", "playwright-report/", "test-results/"]
  }
);
