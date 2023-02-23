import axios from "axios";
import store from '@/store';
import router from "@/router";



export const baseURL = 'https://pcapi-xiaotuxian-front-devtest.itheima.net/'

const instance = axios.create({
    baseURL,
    timeout: 5000
})



// 请求拦截器
instance.interceptors.request.use(function (config) {
    let { profile } = store.state.user;


    // 判断是否有token 
    if (profile.token) {
        config.headers.Authorization = `Bearer${profile.token}`
    }
    return config;
}, function (err) {
    // 错误就返回一个错误的Promis对象
    return Promise.reject(err)
})



// 响应拦截器
instance.interceptors.response.use((res) => {
    return res.data
}, (err) => {
    // 这里要判断是否出现了401 错误的情况 
    if (err.response && err.response.status == 401) {
        // 1清空无效的路由信息，
        // 2跳转到登录页
        // 跳转需要传递参数，如果登录后就可以再跳回之前的页面

        // 清空user信息【由于绑定了本地存储插件所以可以自动将本地存储的数据清空】
        store.commit('user/setUser', {});
        // 由于currentRoute是ref响应性的对象所以需要.value
        // encodeURIComponent 可以将路径后面拼接的符号转化成百分号这些
        //encodeURIComponent("/url?a=1&b=1")
        // '%2Furl%3Fa%3D1%26b%3D1'
        let fullPath = encodeURIComponent(router.currentRoute.value.fullPath);
        router.push('/login?redirectUrl=' + fullPath)
    }
    return Promise.reject(err)
})


// 请求工具函数
// 路径
// 方法
// 参数对象
export default (url, method, submitData) => {
    return instance({
        url,
        method,
        // 这里的参数需要通过传递的是什么请求方式来判断需要传递什么参数
        [method.toLowerCase() == 'get' ? 'params' : 'data']: submitData
    })
}







