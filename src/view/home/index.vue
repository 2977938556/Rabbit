<template>
    <!-- 最大的容器 -->
    <div class="page-home">


        <!--  限制容器 -->
        <div class="home-entry">
            <!-- 首页入口 -->
            <div class="container">
                <!-- 左侧分类 -->
                <HomeCategory />
                <!-- 左侧轮播图页面 -->

                <HomeBanner />

            </div>
        </div>


        <!--产品精选 和人气爆款 -->
        <div class="home-new">
            <div class="container">
                <HomeNew />
                <HomeHot />
            </div>
        </div>


        <button @click="show = true">显示</button>
        <button @click="show = false">隐藏</button>

        <Transition>
            <div class="box" v-show="show">
                <h1>Hello Transition</h1>
            </div>
        </Transition>


    </div>
</template>

<script>
// 01 入口
// 分类
import HomeCategory from '@/view/home/components/home-category.vue';
// banner 
import HomeBanner from '@/view/home/components/home-banner.vue';

// 02 产品精选
import HomeNew from '@/view/home/components/home-new.vue';

// 03 人气爆款
import HomeHot from '@/view/home/components/home-hot.vue';
import { ref } from 'vue';



export default {
    name: "Home",
    components: {
        HomeCategory,
        HomeBanner,
        HomeNew,
        HomeHot
    },
    setup() {
        let show = ref(true);
        return {
            show
        }
    }



}




</script>

<style lang="less" scoped>
.box {
    width: 300px;
    height: 300px;
    text-align: center;
    background: orange;
}



// 进入
.v-enter-from {
    width: 0px;
    height: 0px;
}

.v-enter-active {
    transition: 0.5s ease;
}

.v-enter-to {
    width: 300px;
    height: 300px;
}



.v-leave-from {
    width: 300px;
    height: 300px;
}

.v-leave-active {
    transition: all 0.5s ease;
}

.v-leave-to {
    width: 0px;
    height: 0px;

}
</style>




