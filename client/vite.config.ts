import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    origin: 'http://127.0.0.1:3290',
    host: '127.0.0.1',
    port: 3290,
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['/server/CoWrite']
    },
  },
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
})
