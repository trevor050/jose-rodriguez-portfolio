import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  base: '/',
  publicDir: 'public',
  server: {
    port: 5173,
    host: true,
    open: true,
    cors: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  },
  css: {
    devSourcemap: true
  }
}) 