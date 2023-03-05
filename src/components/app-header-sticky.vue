<template>
    <div class="app-header-sticky" :class="{ stickys: y > 78 }">
        <div class="container" v-show="y > 78">
            <RouterLink class="logo" to="/" />
            <!-- 分类组件 -->
            <AppHeaderNav />

            <div class="right">
                <RouterLink to="/">品牌</RouterLink>
                <RouterLink to="/">专题</RouterLink>
            </div>
        </div>
    </div>
</template>




<script>
/* 分类组件 */
import AppHeaderNav from '@/components/app-header-nav.vue';

// 导入插件获取y轴坐标
import { useWindowScroll } from '@vueuse/core'

import { onMounted, ref } from 'vue';

export default {
    setup() {


        // 导航吸顶【的传统方式实现】
        // 页面元素加载完成
        // let y = ref(0);
        // onMounted(() => {
        //     window.addEventListener('scroll', () => {
        //         y.value = document.documentElement.scrollTop;
        //     })
        // })

        // 导航吸顶的插件形式实现【高级懒】
        const { y } = useWindowScroll()
        return { y }
    },
    components: {
        AppHeaderNav,
    }
}



</script>







<style scoped lang='less'>
.app-header-sticky {
    width: 100%;
    height: 80px;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 999;
    background-color: #fff;
    border-bottom: 1px solid #e4e4e4;
    opacity: 0;
    transform: translateY(-100%);



    .container {
        display: flex;
        align-items: center;
    }

    .logo {
        width: 200px;
        height: 80px;
        background: url(../assets/images/logo.png) no-repeat right 2px;
        background-size: 160px auto;
    }

    .right {
        width: 220px;
        display: flex;
        text-align: center;
        padding-left: 40px;
        border-left: 2px solid @xtxColor;

        a {
            width: 38px;
            margin-right: 40px;
            font-size: 16px;
            line-height: 1;

            &:hover {
                color: @xtxColor;
            }
        }
    }


    // 显示与隐藏
    &.stickys {
        transition: all 0.3s ease-in;
        opacity: 1;
        transform: translateY(0%);
    }
}
</style>

