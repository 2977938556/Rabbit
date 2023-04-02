<template>
    <div class="container">
        <AppMemberAside />

        <article class="article">
            <!-- 这里是二级路由 -->
            <RouterView />
        </article>
    </div>
</template>
<script>
// 这里是导入右侧菜单
import AppMemberAside from '@/components/app-member-aside.vue'

export default {
    name: 'MemberLayout',
    components: {
        AppMemberAside
    }
}
</script>
<style scoped lang="less">
.container {
    display: flex;
    padding-top: 20px;

    .article {
        width: 1000px;
    }
}
</style>