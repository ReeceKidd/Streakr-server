module.exports = {
  transform: {
    "^.+\\.ts?$": "ts-jest"
  },
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  testEnvironment: "node",
  modulePathIgnorePatterns: ["./coverage/*", "./jest.config.js", "./dist/*"],
  testMatch: ["**/src/**/*.spec.(ts|js)"]
};
