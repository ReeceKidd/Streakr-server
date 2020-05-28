module.exports = {
    preset: 'ts-jest',
    coverageThreshold: {
        global: {
            branches: 90,
            functions: 90,
            lines: 90,
            statements: 90,
        },
    },
    testEnvironment: 'node',
    modulePathIgnorePatterns: ['./coverage/*', './jest.config.js', './dist/*', './tests/*'],
};
