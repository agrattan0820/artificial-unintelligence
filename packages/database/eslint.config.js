// Flat ESLint config for database package (CommonJS)
const customLibrary = require("eslint-config-custom/library.js");

module.exports = [
  ...customLibrary,
  {
    // Keep legacy ignore behavior
    ignores: ["**/*.js"],
  },
];
