module.exports = {
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    coverageThreshold: {
        global: {
            branches: 90,
            functions: 90,
            lines: 90,
            statements: 90,
        },
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    testEnvironment: 'node',
    modulePathIgnorePatterns: ['./coverage/*', './jest.config.js', './dist/*', './tests/*'],
    testMatch: ['**/src/**/*.spec.(ts|js)'],
};
