<template>
    <div class="xtx-infinite-loading" ref="container">
        <div class="loading" v-if="loading">
            <span class="img"></span>
            <span class="text">正在加载...</span>
        </div>
        <div class="none" v-if="finished">
            <span class="img"></span>
            <span class="text">亲，没有更多了</span>
        </div>
    </div>
</template>
  
<script>
import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
export default {
    name: 'XtxinfiniteLoding',
    props: {
        // 这个是调用方 传递的是否在加载中
        loading: {
            type: Boolean,
            default: false
        },
        // 这个是判断是否还有数据
        finished: {
            type: Boolean,
            default: false
        }
    },

    setup(props, { emit }) {
        let container = ref(null)
        // 01 我们要做的就是如果加载组件进入了可视区那么就发送请求获取数据
        useIntersectionObserver(container, ([{ isIntersecting }], dom) => {
            // 如果都为false那么就这么慢
            if (props.loading == false && props.finished == false) {
                // 调用自定义事件让调用者使用
                emit("infinite");
            }
        })
        return { container }
    }

}
</script>
  
<style scoped lang='less'>
.xtx-infinite-loading {
    .loading {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 200px;

        .img {
            width: 50px;
            height: 50px;
            background: url(../../assets/images/load.gif) no-repeat center / contain;
        }

        .text {
            color: #999;
            font-size: 16px;
        }
    }

    .none {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 200px;

        .img {
            width: 200px;
            height: 134px;
            background: url(../../assets/images/none.png) no-repeat center / contain;
        }

        .text {
            color: #999;
            font-size: 16px;
        }
    }
}
</style>