import { defineWorkspace } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineWorkspace([
  {
    plugins: [vue()],
    resolve: {
      alias: {
        '#shared': path.resolve(dirname, './shared'),
      },
    },
    test: {
      name: 'unit',
      environment: 'happy-dom',
      include: ['**/*.test.ts'],
      exclude: ['**/*.integration.test.ts', 'node_modules/**', '.nuxt/**', 'e2e/**'],
      setupFiles: ['./server/testing/setup.unit.ts'],
    },
  },
  {
    resolve: {
      alias: {
        '#shared': path.resolve(dirname, './shared'),
      },
    },
    test: {
      name: 'integration',
      environment: 'node',
      include: ['**/*.integration.test.ts'],
      exclude: ['node_modules/**', '.nuxt/**', 'e2e/**'],
      setupFiles: ['./server/testing/setup.ts'],
      testTimeout: 30000,
      hookTimeout: 30000,
    },
  },
]);
