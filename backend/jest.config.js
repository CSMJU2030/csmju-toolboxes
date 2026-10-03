// backend/jest.config.js

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  roots: ['<rootDir>/src'],

  testMatch: [
    '**/?(*.)+(spec|test).[tj]s',
  ],

  moduleFileExtensions: [
    'js',
    'json',
    'ts',
  ],

  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.json',
      },
    ],
  },

  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/generated/**',
    '!src/**/*.spec.ts',
  ],
};