import { config } from "eslint-config-custom/library";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...config,
  {
    ignores: ["**/*.js"],
  },
];
