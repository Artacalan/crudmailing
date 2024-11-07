module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'js'],
    testMatch: ['**/*.test.ts'],  // Correspond aux fichiers de test TypeScript
    globals: {
        'ts-jest': {
            isolatedModules: true,
        },
    },
};