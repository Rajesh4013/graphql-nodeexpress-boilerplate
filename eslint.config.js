import globals from 'globals';
import pluginJs from '@eslint/js';
import importPlugin from 'eslint-plugin-import';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    languageOptions: {
      globals: globals.browser,
    },
  },
  pluginJs.configs.recommended,
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
        },
      ],
      'no-console': 'warn',
      'no-unused-vars': 'error',
    },
  },
];
