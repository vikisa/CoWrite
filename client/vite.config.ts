import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    server: {
      host: 'localhost',
      port: 3290
    },
    plugins: [
      vue(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    envDir: '/',
    define: {
      'process.env.APP_BASE_URL': JSON.stringify(env.APP_BASE_URL),
      'process.env.APP_ROOT_API': JSON.stringify(env.APP_ROOT_API),
      'process.env.APP_COLLAB_API': JSON.stringify(env.APP_COLLAB_API),
      'process.env.APP_SOCKET_API': JSON.stringify(env.APP_SOCKET_API),
    },
  };
});
