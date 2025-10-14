/** @type {import('jest').Config} */
module.exports = {
  roots: ['<rootDir>/tests', '<rootDir>/src'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  // TS -> CJS juste pour Jest (on évite tout le bazar ESM)
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        module: 'commonjs',
        moduleResolution: 'node',
        target: 'es2020',
        esModuleInterop: true,
        strict: true
      }
    }]
  },
  testMatch: ['**/tests/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  testPathIgnorePatterns: ['/node_modules/'],
  verbose: true,
  coverageThreshold: { global: { branches: 0, functions: 0, lines: 0, statements: 0 } }
};
