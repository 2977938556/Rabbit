import { createRouter, createWebHashHistory } from 'vue-router'


let Layout = () => import('@/view/Layout.vue');
let Home = () => import('@/view/home/index.vue');

let routes = [
    {
        path: '/', component: Layout,
        children: [
            { path: '/', component: Home }
        ]
    }
]


let router = createRouter({
    history: createWebHashHistory(),
    routes,
})


export default router;