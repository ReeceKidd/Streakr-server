module.exports = {
  transform: {
    "^.+\\.ts?$": "ts-jest"
  },
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95
    }
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  testEnvironment: "node",
  modulePathIgnorePatterns: [
    "./coverage/*",
    "./jest.config.js",
    "./dist/*",
    "./tests/*"
  ],
  testMatch: ["**/src/**/*.spec.(ts|js)"]
};
