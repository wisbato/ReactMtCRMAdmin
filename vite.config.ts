import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://192.168.29.36:5005', // Your backend IP + port
        changeOrigin: true,
        secure: false,   // If your backend is HTTP, not HTTPS
        rewrite: (path) => path.replace(/^\/api/, '/api') // optional if same path
      }
    }
  }
})
