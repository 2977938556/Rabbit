import { createStore } from 'vuex'

// 引入vuex 数据持久化
import createPersistedState from 'vuex-persistedstate'


// 数据模块
import user from './modules/user.js'
import cart from './modules/cart.js'
import category from './modules/category.js'



// 配置数据据模块
let store = createStore({
    // 模块分组
    modules: {
        user,
        cart,
        category,
    },
    plugins: [createPersistedState({
        key: 'erabbit-client-pc-store',
        paths: ['user', 'cart'],
    })]

})


export default store