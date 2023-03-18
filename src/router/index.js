import { createRouter, createWebHashHistory } from 'vue-router'



// 布局组件
let Layout = () => import('@/view/Layout.vue');
// 首页
let Home = () => import('@/view/home/index.vue');

// 一级分类
let TopCategory = () => import('@/view/category/index.vue')
// 二级分类
let SubCategory = () => import('@/view/category/sub.vue');


// 商品详情模块
let Goods = () => import('@/view/goods/index.vue');



// 登录模块
let Login = () => import('@/view/login/index.vue')




let routes = [
    {
        path: '/', component: Layout,// 首页容器
        children: [
            { path: '/', component: Home },// 首页主页
            { path: '/category/:id', component: TopCategory },// 商品第一级
            { path: '/category/sub/:id', component: SubCategory }, // 商品分类第二级
            { path: '/product/:id', component: Goods }//商品详情模块
        ]
    },
    { path: '/login', component: Login }// 登录模块
]


let router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        // 如果有 savedPosition，则直接返回保存的位置
        if (savedPosition) {
            return savedPosition;
        }
        // 否则返回顶部
        return { top: 0 };
    }
})


export default router;