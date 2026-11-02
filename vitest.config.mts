import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  esbuild: { jsx: 'automatic' },
  resolve: {
    alias: [
      { find: /^@\/src\//, replacement: path.resolve(__dirname, 'src') + '/' },
      {
        find: /^@\/utils\//,
        replacement: path.resolve(__dirname, 'src/utils') + '/',
      },
      {
        find: /^@\/services\//,
        replacement: path.resolve(__dirname, 'src/services') + '/',
      },
    ],
  },
  test: {
    environment: 'jsdom',
    passWithNoTests: true,
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
