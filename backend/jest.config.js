module.exports = {
  testEnvironment: 'node',
  clearMocks: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/infrastructure/database/connection.js',
    '!src/presentation/routes/*.js'
  ],
  testMatch: ['**/__tests__/**/*.test.js', '**/?(*.)+(spec|test).js']
};
