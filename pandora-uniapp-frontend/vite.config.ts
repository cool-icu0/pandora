import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

export default defineConfig({
  plugins: [uni()],
  optimizeDeps: {
    include: ['@dcloudio/uni-app', '@dcloudio/uni-components']
  },
  server: {
    port: 5173,
    host: true
  },
  build: {
    target: 'es2015',
    rollupOptions: {
      external: []
    }
  }
})