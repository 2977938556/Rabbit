<template>
    <div class="top-category">
        <!-- 容器 -->
        <div class="container">
            <!-- 面包屑 -->
            <XtxBread>
                <XtxBreadItem to="/">首页</XtxBreadItem>
                <XtxBreadItem :to="{ path: '/category/100050' }">电器</XtxBreadItem>
                <XtxBreadItem>电热水器</XtxBreadItem>
            </XtxBread>
            <!-- 轮播图 -->
            <!-- 全部分类 -->
            <!-- 推荐商品 -->


        </div>
    </div>
</template>
<script>
export default {
    name: 'TopCategory'
}
</script>
<style scoped lang="less"></style>