<template>
    <!-- 顶部通栏组件 -->
    <AppTopNavBar />

    <!-- 导航吸顶组件 -->
    <AppHeaderStkcky />

    <!-- 导航组件 -->
    <AppHeader />


    <!-- 内容区 -->
    <div class="app-main">
        <router-view></router-view>
    </div>

    <!-- 底部组件 -->
    <AppFooter />
</template>



<script>

// 导入组件
import AppTopNavBar from '@/components/app-topnavbar.vue';
import AppHeader from '@/components/app-header.vue';
import AppFooter from '@/components/app-footer.vue';

// 导入需要浮出的动画
import AppHeaderStkcky from '@/components/app-header-sticky.vue';


// 导入vuex
import { useStore } from 'vuex'




export default {
    setup() {
        let store = useStore()
        // 调用获取导航分类数据
        store.dispatch('category/getList');
    },
    components: {
        AppTopNavBar,
        AppHeader,
        AppFooter,
        AppHeaderStkcky,
    }



}



</script>




<style scoped lang="less">
.app-main {
    min-height: 600px;

}
</style>