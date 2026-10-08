// @ts-check

const eslint = require("@eslint/js");
const { defineConfig } = require("eslint/config");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = defineConfig([
  {
    ignores: [
      "dist/**",
      "coverage/**",
      "node_modules/**",
      ".angular/**",
    ],
  },

  {
    files: ["**/*.ts"],

    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      angular.configs.tsRecommended,
    ],

    processor: angular.processInlineTemplates,

    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },

    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],

      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],

      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/no-unnecessary-condition": "warn",
      "@typescript-eslint/prefer-nullish-coalescing": "warn",
      "@typescript-eslint/prefer-optional-chain": "warn",
      "@typescript-eslint/consistent-type-imports": "warn",
    },
  },

  {
    files: [
      "src/**/*.component.ts",
    ],

    rules: {
      "@typescript-eslint/unbound-method": "off",
    },
  },

  {
    files: ["**/*.html"],

    extends: [
      angular.configs.templateRecommended,
      angular.configs.templateAccessibility,
    ],

    rules: {},
  },
]);