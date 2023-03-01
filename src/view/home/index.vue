<template>
    <!-- 最大的容器 -->
    <div class="page-home">
        <div class="container">
            <!-- 首页入口 -->
            <div class="home-entry">
                <!-- 左侧分类 -->
                <HomeCategory />
                <!--  左侧轮播图页面 -->
            </div>
        </div>

    </div>
</template>

<script>
import HomeCategory from '@/view/home/components/home-category.vue';

export default {
    name: "Home",
    components: {
        HomeCategory,
    }

}




</script>

<style lang="less" scoped></style>

