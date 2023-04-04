import { createRouter, createWebHashHistory, RouterView } from 'vue-router'

import { h } from 'vue'

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
let Checkout = () => import('@/view/member/pay/checkout.vue')


// 下单结算页面
let SettleAccount = () => import('@/view/member/pay/index.vue')

// 下单结算页面
let Result = () => import('@/view/member/pay/result.vue')



// 个人中心页面
let UserLayout = () => import('@/view/member/home/Layout.vue')
// 个人中心首页
let UserLayoutHome = () => import('@/view/member/home/component/home.vue')

// 个人订单页面
let MemberOrder = () => import('@/view/member/order/index.vue')
// 订单详情
let MemberOrderDetail = () => import('@/view/member/order/detail.vue')





let routes = [
    {
        path: '/', component: Layout,// 首页容器
        children: [
            { path: '/', component: Home },// 首页主页
            { path: '/category/:id', component: TopCategory },// 商品第一级
            { path: '/category/sub/:id', component: SubCategory }, // 商品分类第二级
            { path: '/product/:id', component: Goods },//商品详情模块
            { path: '/cart', name: 'cart', component: Cart },// 购物车模块
            { path: "/member/checkout", component: Checkout },// 下单结算页面
            { path: "/member/pay", component: SettleAccount },// 支付页面
            { path: '/pay/callback', component: Result },// 支付结果页面
            {
                path: '/member', component: UserLayout, children: [// 个人中心页面 
                    { path: '/member', component: UserLayoutHome },// 加载的个人中心的首页

                    // 以下的方式会导致类名没有被添加上
                    // { path: '/member/order', component: MemberOrder },// 个人订单页面
                    // { path: '/member/order/:id', component: MemberOrderDetail }// 个人订单详情页面

                    // 这个方式是为了深度层次添加激活类名
                    {
                        path: '/member/order',
                        component: { render: () => h(RouterView) },
                        children: [
                            { path: '', component: MemberOrder },// 个人订单页面
                            { path: ':id', component: MemberOrderDetail }// 个人订单详情页面
                        ]
                    }


                ]
            }// 个人中心页面
        ]
    },
    { path: '/login', component: Login },// 登录模块
    { path: "/login/callback", component: Callback },// QQ回调地址模块

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
router.beforeEach((to, from, next) => {
    // 获取是否登录
    let { profile } = store.state.user

    // 这里判断的是 你跳转到member 页面但是没有登录的情况
    if (to.path.startsWith('/member') && !profile.token) {
        next({ path: '/login', query: { redirectUrl: to.fullPath } })
    }
    next()

})


export default router;