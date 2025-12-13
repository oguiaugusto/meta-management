import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/shared/test/setup.ts'], // Optional: for global test setup
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/generated/**',
        '**/prisma/**',
      ],
    },
    pool: 'forks',
    maxWorkers: 1,
  },
});
