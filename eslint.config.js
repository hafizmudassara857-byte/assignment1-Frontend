import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        console: "readonly",
        document: "readonly",
        Event: "readonly",
        FormData: "readonly",
        import: "readonly",
        localStorage: "readonly",
        setTimeout: "readonly",
        window: "readonly",
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      "no-unused-vars": "off",
      "no-undef": "error",
      "no-useless-catch": "off",
    },
  },
  {
    ignores: ["dist/**", "node_modules/**"],
  },
];
