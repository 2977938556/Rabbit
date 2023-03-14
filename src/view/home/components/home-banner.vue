<template>
    <div class="home-banner">
        <XtxCarousel :sliders="sliders" />
    </div>
</template>
<script>

import { findBranner } from '@/api/home.js'
import { ref } from 'vue'



export default {
    name: 'HomeBanner',
    setup() {
        // 收集banner数据传递给全局插件里
        let sliders = ref([]);
        findBranner().then(res => {
            sliders.value = res.result;
        })


        return { sliders }


    }
}
</script>


<style lang="less" scoped>
.home-banner {
    width: 1240px;
    height: 500px;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 98
}


// 设置组件样式穿透
.xtx-carousel {
    :deep(.carousel-btn).prev {
        left: 270px;
    }

    :deep(.carousel-indicator) {
        padding-left: 250px;
    }
}
</style>