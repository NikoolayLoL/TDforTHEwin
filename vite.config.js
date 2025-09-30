import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'pages/index.html'),
        game: resolve(__dirname, 'pages/game.html'),
        blitz: resolve(__dirname, 'pages/blitz.html'),
        inventory: resolve(__dirname, 'pages/inventory.html'),
      },
    },
  },
  server: {
    open: '/pages/',
  },
});
