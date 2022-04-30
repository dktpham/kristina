/* eslint-env node */
module.exports = {
  env: {
    browser: true,
  },
  extends: [
    "prettier",
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  plugins: ["prettier", "react", "@typescript-eslint"],
  rules: {
    "react/react-in-jsx-scope": "off",
    quotes: ["error", "double"],
    semi: [2, "never"],
  },
  parserOptions: {
    sourceType: "module",
    ecmaVersion: "latest",
    requireConfigFile: false,
    ecmaFeatures: {
      jsx: true,
    },
    babelOptions: {
      presets: ["@babel/preset-react"],
    },
    parser: "@babel/eslint-parser",
  },
}
