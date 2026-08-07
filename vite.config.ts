import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        eprog24: resolve(__dirname, 'eprog24.html'),
        eprog25: resolve(__dirname, 'eprog25.html'),
        pong: resolve(__dirname, 'pong/index.html'),
        snake: resolve(__dirname, 'snake/snake.html'),
      },
    },
  },
})
