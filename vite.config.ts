import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
      '/users': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
      '/reports': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
      '/analytics': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
      '/activities': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
      '/notifications': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
