import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['./server/testing/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['.nuxt/**', 'node_modules/**', 'dist/**', '*.config.{js,ts}', 'prisma/**'],
    },
  },
});
