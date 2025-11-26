import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Konfigurasi Tailwind & PostCSS dimasukkan terus di sini
export default defineConfig({
  plugins: [react()],
})