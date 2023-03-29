// 导入vueuse/core
import {ref,onUnmounted} from "vue"

// 提供复用逻辑的函数（钩子）
import { useIntersectionObserver, useIntervalFn } from '@vueuse/core'
import dayjs from 'dayjs'


// 这个方法是到了可视化的区域就请求加载数据
export const Datalazyloading = (apiFn) => {
    let result = ref([]);
    // 这里声明的一个获取dom元素ref
    let target = ref(null)
    let { stop } = useIntersectionObserver(target, ([{ isIntersecting }], observerElement) => {
        //判断是否进入可视区域
        if (isIntersecting) {
            stop();
            apiFn().then(res => {
                result.value = res.result
            })
        }
    }, {
        threshold: 0
    })


    // 将数据返回出去并且将dom元素返回出去
    return { result, target };
}



// 封装一个订单倒计时组件
export const orderCountDown = () =>{
    let trim = ref(0)
    let trimText = ref('')

     // 订单倒计时
    let {pause,resume} =  useIntervalFn(()=>{
        trim.value--
        trimText.value = dayjs.unix(trim.value).format('mm分ss秒')
        if (trim.value <= 0){
             pause()
        }
    })

    // 组件退出的时候就是清除定时器
    onUnmounted(()=>{
         pause()
    })

    // 开启定时器
    let start = (countdown)=>{
        // 赋值给time
       trim.value = countdown
       // 格式化时间
       trimText.value = dayjs.unix(trim.value).format('mm分ss秒')
       resume()
    }

    return {start,trimText}
}



