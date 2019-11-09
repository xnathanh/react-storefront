module.exports = {
  parser: 'babel-eslint',
  plugins: ['react-storefront-internal'],
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      legacyDecorators: true
    }
  },
  rules: {
    'react-storefront-internal/no-calls-in-module-scope': 1
  }
}
