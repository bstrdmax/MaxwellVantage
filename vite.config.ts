
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default ({
  build: {
    sourcemap: false // Disable source maps to prevent source code exposure
  }
})
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
