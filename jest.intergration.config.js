module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    modulePathIgnorePatterns: ['./coverage/*', './jest.config.js', './dist/*'],
    testMatch: ['**/tests/**/*.spec.(ts|js)'],
};
