import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // alias: [
    //   { find: '@', replacement: path.resolve(__dirname, 'src') },
    //   { replacement: path.resolve(__dirname, './src/features/search') }
    // ],
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@search': path.resolve(__dirname, '/src/features/search'),
    }
  },
})
