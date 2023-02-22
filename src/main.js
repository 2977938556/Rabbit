import { createApp } from 'vue'
import App from './App.vue'

let app = createApp(App)


// 配置路由
import router from '@/router/index.js'
app.use(router)


// 配置Vuex
import store from '@/store/index.js'
app.use(store)



app.mount('#app')
