import { createApp } from 'vue'
import App from './App.vue'

let app = createApp(App)


// 配置路由
import router from '@/router/index.js'
app.use(router)


// 配置Vuex
import store from '@/store/index.js'
app.use(store)


// 重置样式
import 'normalize.css'
import '@/assets/styles/common.less'



// 注册插件 UI 骨架
import UI from '@/components/libray/index.js'
app.use(UI)








app.mount('#app')
