/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  testPathIgnorePatterns: [".d.ts", ".js"],
  preset: 'ts-jest',
  testEnvironment: 'node',
};