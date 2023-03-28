import { createRouter, createWebHashHistory } from 'vue-router'


// 导入数据仓库
import store from '@/store/index.js'


// 布局组件
let Layout = () => import('@/view/Layout.vue');
// 首页
let Home = () => import('@/view/home/index.vue');



// 一级分类 
let TopCategory = () => import('@/view/category/index.vue')
// 二级 产品展示菜单
let SubCategory = () => import('@/view/category/sub.vue');




// 商品详情模块
let Goods = () => import('@/view/goods/index.vue');



// 登录模块
let Login = () => import('@/view/login/index.vue')

// qq登录的回调地址
let Callback = () => import('@/view/login/callback.vue')




// 购物车模块
let Cart = () => import('@/view/cart/index.vue')



// 下单页面
let Checkout = ()=> import('@/view/member/pay/checkout.vue')



let routes = [
    {
        path: '/', component: Layout,// 首页容器
        children: [
            { path: '/', component: Home },// 首页主页
            { path: '/category/:id', component: TopCategory },// 商品第一级
            { path: '/category/sub/:id', component: SubCategory }, // 商品分类第二级
            { path: '/product/:id', component: Goods },//商品详情模块
            { path: '/cart', name: 'cart', component: Cart },// 购物车模块

        ]
    },
    { path: '/login', component: Login },// 登录模块
    { path: "/login/callback", component: Callback },// QQ回调地址模块
    {path:"/member/checkout",component:Checkout},// 下单结算页面
]

        let router = createRouter({
            history: createWebHashHistory(),
            // mode: 'history',
            routes,
            scrollBehavior(to, from, savedPosition) {
                // 如果有 savedPosition，则直接返回保存的位置
                return { x: 0, y: 0 }
            }
        })



// 路由前置守卫
router.beforeEach((to   , from, next) => {

    // 获取是否登录
    let { profile } = store.state.user

    // 这里判断的是 你跳转到member 页面但是没有登录的情况
    if (to.path.startsWith('/member') && !profile.token) {
        next({ path: '/login', query: { redirectUrl: to.fullPath } })
    }
    next()

})





export default router;