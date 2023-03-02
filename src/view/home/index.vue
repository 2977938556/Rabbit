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


        <!--产品精选 和人气爆款  品牌推荐-->
        <div class="home-new">
            <div class="container">
                <HomeNew />
                <HomeHot />
                <HomeBrand />
                <HomeProduct />
                <HomeSpecial />
            </div>
        </div>


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

//04 热门品牌
import HomeBrand from '@/view/home/components/home-brand.vue'

// 05 商品专区
import HomeProduct from '@/view/home/components/home-product.vue';



// 06 最新专题
import HomeSpecial from '@/view/home/components/home-special.vue'




import { ref } from 'vue';



export default {
    name: "Home",
    components: {
        HomeCategory,
        HomeBanner,
        HomeNew,
        HomeHot,
        HomeBrand,
        HomeProduct,
        HomeSpecial

    },
    setup() {
        let show = ref(true);
        return {
            show
        }
    }



}




</script>



