import tsParser from "@typescript-eslint/parser";

const dateMessage =
  "Do not use Date APIs. Use Temporal and unix timestamp helpers instead.";

export default [
  {
    files: ["**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}"],
    languageOptions: {
      parser: tsParser,
      sourceType: "module",
      ecmaVersion: "latest",
    },
    rules: {
      "no-restricted-globals": [
        "error",
        {
          name: "Date",
          message: dateMessage,
        },
      ],
      "no-restricted-properties": [
        "error",
        {
          object: "Date",
          property: "now",
          message: dateMessage,
        },
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector: "NewExpression[callee.name='Date']",
          message: dateMessage,
        },
      ],
    },
  },
];
