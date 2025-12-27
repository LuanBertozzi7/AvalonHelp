import js from "@eslint/js";

export default [
  js.configs.recommended,

  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        console: "readonly",
        process: "readonly",
        Buffer: "readonly",
        setTimeout: "readonly",
        setInterval: "readonly",
        clearTimeout: "readonly",
        clearInterval: "readonly",
      },
    },

    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-undef": "error",
      "no-redeclare": "error",
      "no-var": "error",
      "prefer-const": "warn",
      "eqeqeq": ["error", "always"],
      "no-console": "off",

      /* =========================
       * Async / Promises
       * ========================= */
      "no-async-promise-executor": "error",
      "no-promise-executor-return": "error",
      "require-await": "off",

      "semi": ["error", "always"],
      "quotes": ["error", "double", { allowTemplateLiterals: true }],
      "comma-dangle": ["error", "always-multiline"],
      "object-curly-spacing": ["error", "always"],
      "array-bracket-spacing": ["error", "never"],
      "arrow-spacing": ["error", { before: true, after: true }],
      "keyword-spacing": ["error", { before: true, after: true }],

      /* =========================
       * Discord.js friendly
       * ========================= */
      "no-empty-function": "off",
      "no-useless-return": "warn",
      "no-case-declarations": "off",

      /* =========================
       * Imports
       * ========================= */
      "no-duplicate-imports": "error",

      "max-len": [
        "warn",
        {
          code: 120,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreComments: true,
        },
      ],
    },
  },
];
