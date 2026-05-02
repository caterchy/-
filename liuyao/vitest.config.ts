import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(viteConfig, defineConfig({
  test: {
    globals: false,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/engine/**', 'src/data/**', 'src/stores/**', 'src/composables/**'],
      exclude: ['src/**/*.test.ts', 'src/**/__tests__/**', 'src/{types,router}/**'],
      thresholds: { statements: 90, branches: 85, functions: 90, lines: 90 },
      reportsDirectory: './coverage',
    },
  },
}))
