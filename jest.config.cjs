const { pathsToModuleNameMapper } = require('ts-jest')
const { compilerOptions } = require('./tsconfig.base.json')

module.exports = {
  preset: 'ts-jest/presets/default-esm'
, resolver: '@blackglory/jest-resolver'
, testEnvironment: 'jsdom'
  // 创建Worker的速度比较慢, 默认的5秒可能不够.
, testTimeout: 1000 * 10
, testEnvironmentOptions: {
    // 覆盖jsdom环境下的默认选项, 避免在导入时使用browser字段.
    customExportConditions: ['node', 'node-addons']
  }
, testMatch: ['**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)']
, moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/'
  })
}
