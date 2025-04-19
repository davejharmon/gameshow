import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build', // <- This is the important part
  },
  server: {
    proxy: {
      // Proxy WebSocket requests
      '/ws': {
        target: 'ws://localhost:3001',
        ws: true,
      },
    },
  },
});
