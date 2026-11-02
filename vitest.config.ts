import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

const root = __dirname

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^@\/utils\//, replacement: path.resolve(root, 'src/utils') + '/' },
      {
        find: /^@\/services\//,
        replacement: path.resolve(root, 'src/services') + '/',
      },
      { find: /^@\//, replacement: root + '/' },
    ],
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: false,
  },
})
