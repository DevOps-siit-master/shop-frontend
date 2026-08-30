import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/order-api': {
        target: process.env.VITE_ORDER_TARGET ?? 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/order-api/, ''),
      },
      '/payment-api': {
        target: process.env.VITE_PAYMENT_TARGET ?? 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/payment-api/, ''),
      },
    },
  },
})
