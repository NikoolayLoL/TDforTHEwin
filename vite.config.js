import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        game: resolve(__dirname, 'game.html'),
        inventory: resolve(__dirname, 'inventory.html'),
      },
    },
  },
  server: {
    open: '/',
  },
});
