/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          ionic: ['@ionic/react', '@ionic/react-router', '@ionic/core'],
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    isolate: true,
    fileParallelism: false,
    pool: 'forks',
    clearMocks: true,
    restoreMocks: true,
    coverage: {
      enabled: true,
      provider: 'v8',
      exclude: ['./src/types/**', '**/node_modules/**'],
      // thresholds: { '100': true }, // Only really for v1.0.0 (maybe)
      clean: true,
    },
  },
});
