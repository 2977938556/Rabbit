import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
// import imageBase64 from 'vite-plugin-image-base64'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),
  {
    name: 'image-base64',
    enforce: 'post', // 确保在其他插件处理之后运行
    async transform(src, id) {
      if (/\.(png|jpe?g|gif|svg)$/.test(id)) {
        const maxImageSize = 10 * 1024 // 转换的最大文件大小
        if (src.length < maxImageSize) {
          const data = `data:image/${id.split('.').pop()};base64,${src.toString('base64')}`
          return {
            code: `export default ${JSON.stringify(data)};`,
            map: null
          }
        }
      }
    }
  }],

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








})
