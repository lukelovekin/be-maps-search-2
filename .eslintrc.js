module.exports = {
  parserOptions: {
    sourceType: 'module',
  },
  ignorePatterns: [
    'node_modules',
    '**/.github',
    'dist',
  ],
  extends: ['plugin:@typescript-eslint/recommended'],
  plugins: ['@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  rules: {
    'no-void': 0,
    'no-console': 'error',
    '@typescript-eslint/interface-name-prefix': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-use-before-define': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': 'error', 
    '@typescript-eslint/member-delimiter-style': 0,
    '@typescript-eslint/no-unused-vars': 0,
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: 'return' },
      { blankLine: 'always', prev: '*', next: 'export' },
      { blankLine: 'always', prev: 'const', next: 'const' },
      { blankLine: 'always', prev: 'const', next: '*' },
    ],
  },
};
