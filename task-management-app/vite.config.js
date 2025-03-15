import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'mui': ['@mui/material', '@mui/icons-material'],
          'dnd': ['react-beautiful-dnd'],
          'utils': ['date-fns', 'uuid']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
