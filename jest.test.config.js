module.exports = {
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    testEnvironment: 'node',
    modulePathIgnorePatterns: ['./coverage/*', './jest.config.js', './dist/*'],
    testMatch: ['**/src/**/*.spec.(ts|js)', '**/tests/**/*.spec.(ts|js)'],
};
