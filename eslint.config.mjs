import antfu from '@antfu/eslint-config';
import pluginVueA11y from 'eslint-plugin-vuejs-accessibility';

export default antfu(
  {
    vue: true,
    typescript: {
      tsconfigPath: 'tsconfig.json',
    },
    stylistic: {
      semi: true,
    },
    formatters: {
      css: true,
      html: true,
      markdown: 'prettier',
    },
    rules: {
      // Disable strict-boolean-expressions (too noisy, revisit later)
      'ts/strict-boolean-expressions': 'off',
      // Allow global process/buffer in Nuxt/Node context
      'node/prefer-global/process': 'off',
      'node/prefer-global/buffer': 'off',
      // Allow confirm for dangerous actions (delete account, etc)
      'no-alert': 'off',
    },
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
      '.nuxt/**',
      '.*/**',
      'content/**',
      '**/*.md/**',
    ],
  },
  // Temporarily warn for strictNullChecks transition (TS files only)
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
    rules: {
      'ts/no-unnecessary-condition': 'warn',
      'ts/no-floating-promises': 'warn',
      'ts/no-deprecated': 'warn',
      'ts/no-unsafe-assignment': 'warn',
      'ts/no-unsafe-member-access': 'warn',
      'ts/no-unsafe-argument': 'warn',
      'ts/no-unsafe-return': 'warn',
      'ts/no-misused-promises': 'warn',
    },
  },
  // Allow numbers/booleans in template literals
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
    rules: {
      'ts/restrict-template-expressions': ['error', {
        allowNumber: true,
        allowBoolean: true,
      }],
    },
  },
  // Disable type-aware rules for Vue files (parser issues + OOM in CI)
  {
    files: ['**/*.vue'],
    rules: {
      'ts/no-unsafe-call': 'off',
      'ts/no-unsafe-assignment': 'off',
      'ts/no-unsafe-member-access': 'off',
      'ts/no-unsafe-argument': 'off',
      'ts/no-unsafe-return': 'off',
      'ts/no-unnecessary-boolean-literal-compare': 'off',
      'ts/no-unnecessary-condition': 'off',
      'ts/no-redundant-type-constituents': 'off',
      'ts/restrict-template-expressions': 'off',
    },
  },
  // Relax rules for test files
  {
    files: ['**/*.test.ts', '**/*.integration.test.ts', '**/testing/**/*.ts', 'e2e/**/*.ts'],
    rules: {
      'ts/no-unsafe-assignment': 'off',
      'ts/no-unsafe-argument': 'off',
      'ts/no-unsafe-member-access': 'off',
      'ts/no-unsafe-call': 'off',
      'ts/no-unsafe-return': 'off',
      'ts/unbound-method': 'off',
      'ts/no-unnecessary-condition': 'off',
    },
  },
  // Relax rules for config files
  {
    files: ['*.config.ts', 'prisma/*.ts', 'scripts/*.ts'],
    rules: {
      'ts/no-unsafe-assignment': 'off',
      'ts/no-unsafe-member-access': 'off',
      'ts/no-floating-promises': 'off',
    },
  },
  // Allow global var declarations for singletons
  {
    files: ['server/utils/db.ts', 'server/features/email/email-client.ts'],
    rules: {
      'vars-on-top': 'off',
    },
  },
  // Allow console in server plugins and API routes
  {
    files: ['server/plugins/**/*.ts', 'server/api/**/*.ts'],
    rules: {
      'no-console': 'off',
    },
  },
  // Vue a11y
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
