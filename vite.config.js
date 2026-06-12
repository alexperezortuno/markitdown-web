import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  worker: {
    format: 'iife'
  },
  server: {
    port: Number(process.env.PORT) || 8085
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue'],
          highlight: ['marked', 'highlight.js']
        }
      }
    }
  }
})
