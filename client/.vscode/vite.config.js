import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: "/Stock_portfolio2/",
  plugins: [
    react(),
    tailwindcss(),
  ],
})