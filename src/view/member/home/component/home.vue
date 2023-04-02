<template>
    <div class="member-home" v-if="goods">
        <!-- 头部标题 -->
        <HomeOverview />
        <!-- 收藏 -->
        <HomePanel title="我的收藏">
            <GoodsItem v-for="item in goods" :key="item.id" :goods="item"></GoodsItem>
        </HomePanel>
        <!-- 我的足迹  -->
        <HomePanel title="我的足迹">
            <GoodsItem v-for="item in goods" :key="item.id" :goods="item"></GoodsItem>
        </HomePanel>
        <!-- 猜你喜欢-->
        <GoodsRelevant />


    </div>
</template>
<script>
// 橄榄组件
import HomeOverview from './home-overview.vue'
// 收藏组件
import HomePanel from './home-panel.vue'
// 猜你喜欢组件
import GoodsRelevant from '@/view/goods/components/goods-relevant.vue'
// 获取我的收藏
import { findCollect } from '@/api/member.js'
import { ref } from 'vue'



export default {
    name: 'MemberHome',
    components: { HomeOverview, HomePanel, GoodsRelevant },
    setup() {

        // 这样使用数据是不太合适的需要使用mockjs进行模拟数据
        const goods = ref(null)

        findCollect({
            page: 1,
            pageSize: 4
        }).then((data) => {
            console.log(data);
            goods.value = data.result.items
        })


        return { goods }
    }
}
</script>
<style scoped lang="less"></style>