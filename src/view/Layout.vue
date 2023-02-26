<template>
    <!-- 顶部通栏组件 -->
    <AppTopNavBar />

    <!-- 头部组件 -->
    <AppHeader />

    <!-- 内容区 -->
    <div class="main">
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


// 导入vuex
import { useStore } from 'vuex'




export default {
    setup() {
        let store = useStore()
        store.dispatch('category/getList');





    },




    components: {
        AppTopNavBar,
        AppHeader,
        AppFooter,
    }



}



</script>




<style scoped></style>