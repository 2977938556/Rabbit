import { createRouter, createWebHashHistory } from 'vue-router'



// 布局组件
let Layout = () => import('@/view/Layout.vue');
// 首页
let Home = () => import('@/view/home/index.vue');

// 一级分类
let TopCategory = () => import('@/view/category/index.vue')
// 二级分类
let SubCategory = () => import('@/view/category/sub.vue');


let routes = [
    {
        path: '/', component: Layout,
        children: [
            { path: '/', component: Home },
            { path: '/category/:id', component: TopCategory },
            { path: '/category/sub/:id', component: SubCategory }
        ]
    }
]


let router = createRouter({
    history: createWebHashHistory(),
    routes,
})


export default router;