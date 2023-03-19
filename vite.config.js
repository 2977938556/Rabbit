import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
// import imageBase64 from 'vite-plugin-image-base64'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8080,
    host: true
  },
  plugins: [vue()],

  resolve: {
    // 目录别名
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  // 配置全局样式自动导入
  css: {
    preprocessorOptions: {
      less: {
        additionalData: `
              @import "@/assets/styles/variables.less";
              @import "@/assets/styles/mixins.less";
            `,
      },
    },
  },

  build: {
    rollupOptions: {
      external: ['qc'],
      output: {
        globals: {
          qc: 'window.qc',
        },
      },
    },
  },




})
