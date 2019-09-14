module.exports = {
  env: {
    browser: true,
    es6: true
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    sourceType: "module"
  },
  plugins: ["@typescript-eslint", "@typescript-eslint/tslint"],
  rules: {
    "@typescript-eslint/class-name-casing": "error",
    "@typescript-eslint/indent": "error",
    "@typescript-eslint/prefer-namespace-keyword": "error",
    "@typescript-eslint/type-annotation-spacing": "error",
    "no-var": "error",
    "prefer-const": "error",
    "@typescript-eslint/tslint/config": [
      "error",
      {
        rules: {
          "comment-format": [true, "check-space"],
          "jsdoc-format": true,
          "no-trailing-whitespace": true,
          "one-line": [true, "check-open-brace", "check-whitespace"],
          quotemark: [true, "double", "avoid-escape"],
          semicolon: [true, "always", "ignore-bound-class-methods"],
          whitespace: [
            true,
            "check-branch",
            "check-decl",
            "check-operator",
            "check-module",
            "check-separator",
            "check-type"
          ]
        }
      }
    ]
  }
};
