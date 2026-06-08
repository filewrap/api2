import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

/**
 * Vite Configuration
 * Optimized for React/TypeScript deployment on Vercel and Cloudflare.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      // Proxies API calls to the Cloudflare Worker during development
      '/api': {
        target: 'https://apis.kailashhh.com',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'https://socket.apis.kailashhh.com',
        ws: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', 'zustand', 'three'],
          ui: ['lucide-react', 'framer-motion'],
        },
      },
    },
  },
});
