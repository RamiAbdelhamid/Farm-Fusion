// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    // 📈 زد حد التحذير لحجم التشنك إلى 1500 كيلوبايت
    chunkSizeWarningLimit: 1500
  }
})
