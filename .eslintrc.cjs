module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.build.json'],
    tsconfigRootDir: __dirname
  },
  rules: {
    'no-undef': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'prefer-rest-params': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
  },
  ignorePatterns: ['dist/**/*', 'node_modules/**/*', '*.html'],
  overrides: [
    {
      files: ['*.cjs'],
      env: {
        node: true
      },
      parser: 'espree', // 使用 espree 解析器而不是 TypeScript 解析器
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'script'
      }
    },
    {
      files: ['vite.config.ts', 'vitest.config.ts'],
      env: {
        node: true
      },
      rules: {
        '@typescript-eslint/no-var-requires': 'off'
      }
    }
  ]
}
