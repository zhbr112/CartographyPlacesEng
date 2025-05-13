import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    port: 5000,
    proxy: {
      '/places': {
        target: 'http://zhbr112.ru',
        changeOrigin: true,
      },
      '/user': {
        target: 'http://zhbr112.ru',
        changeOrigin: true,
      },
      '/photos': {
        target: 'http://zhbr112.ru',
        changeOrigin: true,
      },
    }
  }
})
