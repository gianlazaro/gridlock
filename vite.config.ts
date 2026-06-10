import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'ReactJotaiMasonry',
      formats: ['es'],
      fileName: () => 'index.js',
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime', 'react-dom', 'jotai', '@tanstack/react-virtual'],
    },
  },
});
