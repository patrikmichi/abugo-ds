import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/plugin/main.ts'),
      name: 'FigmaDesigner',
      fileName: () => 'code.js',
      formats: ['iife'],
    },
    outDir: 'dist',
    emptyOutDir: false,
    sourcemap: 'inline',
    target: 'es2017',
    minify: false,
    rollupOptions: {
      output: {
        extend: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
