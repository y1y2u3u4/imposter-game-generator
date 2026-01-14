import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Code splitting for better mobile performance
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Separate large vendor libraries
          if (id.includes('node_modules/framer-motion')) {
            return 'framer-motion';
          }
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'ui-icons';
          }
          if (id.includes('node_modules/@radix-ui')) {
            return 'ui-primitives';
          }
        },
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 500,
  },
})
