import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

const r = (p: string) => path.resolve(__dirname, p)

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^@\/utils\/(.*)$/, replacement: r('./src/utils/$1') },
      { find: /^@\/services\/(.*)$/, replacement: r('./src/services/$1') },
      { find: /^@components\/(.*)$/, replacement: r('./src/components/$1') },
      { find: /^@\/(.*)$/, replacement: r('./$1') },
    ],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
