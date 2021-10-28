const prettierRules = require('./.prettierrc')

module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/recommended',
    'plugin:vue/strongly-recommended',
    'plugin:vue/essential',
    'eslint:recommended',
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'object-curly-spacing': ['error', prettierRules.bracketSpacing ? 'always' : 'never'],
    semi: ['error', prettierRules.semi ? 'always' : 'never'],
    quotes: ['error', prettierRules.singleQuote ? 'single' : 'double'],
    'max-len': [
      'error',
      {
        code: prettierRules.printWidth,
        tabWidth: prettierRules.tabWidth,
        ignoreUrls: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      },
    ],
    'no-console': 'error',
  },
}
