const js = require("@eslint/js");

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
    },
    rules: {},
  },
];
