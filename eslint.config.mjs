// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';
import pluginVueA11y from 'eslint-plugin-vuejs-accessibility';

export default withNuxt(
  {
    ignores: [
      'coverage/**',
      'prisma/generated/**',
      'vitest.*.config.ts',
      'content.config.ts',
      'playwright.config.ts',
      'prisma.config.ts',
      'e2e/**',
      'prisma/seed.ts',
      'scripts/**',
    ],
  },
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'warn',
    },
  },
  // Temporarily warn for strictNullChecks transition (TS files only)
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
    rules: {
      '@typescript-eslint/no-unnecessary-condition': 'warn',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-deprecated': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/no-misused-promises': 'warn',
    },
  },
  // Allow numbers/booleans in template literals (common pattern)
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
    rules: {
      '@typescript-eslint/restrict-template-expressions': ['error', {
        allowNumber: true,
        allowBoolean: true,
      }],
    },
  },
  // Disable type-aware rules for Vue files (parser issues + OOM in CI)
  {
    files: ['**/*.vue'],
    rules: {
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/no-redundant-type-constituents': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
    },
  },
  // Relax rules for test files (mocks often use any)
  {
    files: ['**/*.test.ts', '**/*.integration.test.ts', '**/testing/**/*.ts', 'e2e/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
    },
  },
  // Relax rules for config files
  {
    files: ['*.config.ts', 'prisma/*.ts', 'scripts/*.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
    },
  },
  ...pluginVueA11y.configs['flat/recommended'],
  {
    rules: {
      'vuejs-accessibility/label-has-for': ['error', {
        controlComponents: ['UInput', 'UTextarea', 'UCheckbox', 'USelect', 'URadio', 'URadioGroup', 'USelectMenu'],
        required: { some: ['nesting', 'id'] },
      }],
    },
  },
);
