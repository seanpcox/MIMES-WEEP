import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import js from "@eslint/js";

export default [

  // eslint default entries
  { files: ["**/*.{js,mjs,cjs,jsx}"] },
  { languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  js.configs.recommended,
  pluginReactConfig,

  // My own entries to ignore eslint errors for brand new React project
  { languageOptions: { globals: globals.jest } },
  {
    settings: {
      "react": {
        "version": "detect"
      }
    }
  },
  {
    rules: {
      "react/react-in-jsx-scope": 0,
      "react/jsx-uses-react": 0
    }
  }
];