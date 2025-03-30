module.exports = {
    transform: {
      '^.+\\.js$': 'babel-jest' // Use Babel to transpile JavaScript files
    },
    testEnvironment: 'node', // Use Node.js environment for testing
    testMatch: ['**/tests/**/*.test.js'] // Look for test files in the `tests` folder
  };