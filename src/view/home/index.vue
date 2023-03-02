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


        <!--产品精选 -->

    </div>
</template>

<script>
import HomeCategory from '@/view/home/components/home-category.vue';
import HomeBanner from '@/view/home/components/home-banner.vue';

export default {
    name: "Home",
    components: {
        HomeCategory,
        HomeBanner,
    }

}




</script>

<style lang="less" scoped></style>

