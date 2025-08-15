import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
    include: [
      'src/**/*.spec.tsx',
      'src/**/*.spec.ts',
      'src/**/*.test.ts',
      'src/**/*.test.tsx',
    ],
    coverage: {
      reporter: ['text', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        '**/.next/**', // 👈 Exclui TUDO dentro de .next/
        'src/components/ui/**', // 👈 Exclui apenas a pasta 'ui' dentro de components
        'src/const.ts',
        'src/app/api/*',
        'src/lib/auth/__tests__/*',
        '*/types/*',
        '**/_material/**',
        '**/testes/**',
        'next.config.mjs',
        'cypress.config.js',
        'tailwind.config.js',
        'postcss.config.mjs',
        'src/lib/zod-i18n.ts',
        'next-env.d.ts',
        'vitest.config.ts',
        'eslint.config.mjs',
        '*/.next/*', // Pode ser redundante, mas não atrapalha
      ],
    },
  },
  resolve: {
    alias: [
        { find: '@', replacement: path.resolve(__dirname, './src') },
    ],
  },
})
