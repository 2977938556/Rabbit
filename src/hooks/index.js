// 导入vueuse/core
import { useIntersectionObserver } from '@vueuse/core';
import { ref } from 'vue';


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