module.exports = {
  rootDir: './',
  projects: ['<rootDir>'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  },
  testURL: 'http://localhost',
  testMatch: ['<rootDir>/src/**/*.test.js'],
  testPathIgnorePatterns: ['node_modules', 'dist']
};