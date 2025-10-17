/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  plugins: [react()],
  ...(command === 'serve' && {
    test: {
      // globals: true, // Temporarily commented out
      environment: 'jsdom',
      // setupFiles: './src/test/setup.ts', // Temporarily commented out
    },
  }),
}));
