<template>
    <!-- 筛选区 -->
    <div class="sub-filter" v-if="SubCate && !subFalge">
        <!-- 品牌区域 -->
        <div class="item">
            <div class="head">品牌：</div>
            <div class="body">
                <a href="javascript:;" @click="SubCate.brands.selectedProp = bitem.id"
                    :class="{ active: SubCate.brands.selectedProp == bitem.id }" v-for="bitem in SubCate.brands"
                    :key="bitem.id">{{ bitem.name }}</a>
            </div>
        </div>

        <!-- 筛选区域 -->
        <div class="item" v-for="item in SubCate.saleProperties" :key="item.id">
            <div class="head">{{ item.name }}</div>
            <div class="body">
                <a href="javascript:;" @click="item.selectedProp = pitem.id"
                    :class="{ active: item.selectedProp == pitem.id }" v-for="pitem in item.properties" :key="pitem.id">{{
                        pitem.name }}</a>
            </div>
        </div>
    </div>

    <!-- 加载区域 -->
    <div v-else class="sub-filter">
        <XtxSkeleton class="item" width="800px" height="40px" />
        <XtxSkeleton class="item" width="800px" height="40px" />
        <XtxSkeleton class="item" width="600px" height="40px" />
        <XtxSkeleton class="item" width="600px" height="40px" />
        <XtxSkeleton class="item" width="600px" height="40px" />
    </div>
</template>



<script>
import { findSubCategoryFilter } from '@/api/sub.js'


import { useRoute } from 'vue-router'
import { useStore } from 'vuex';
import { ref, watch } from 'vue';

export default {
    name: 'SubFilter',


    setup() {
        let route = useRoute();

        // 筛选的数据
        let SubCate = ref(null);
        // 判断加载的
        let subFalge = ref(false)



        watch(() => route.params.id, (newVal) => {
            // 判断是否是在当前路由及数据是否变化
            if (newVal && `/category/sub/${newVal}` == route.path) {
                findSubCategoryFilter(newVal).then(res => {
                    // 数据加载成功
                    subFalge.value = true;




                    // 给品牌数据添加一个判断是否选中的
                    res.result.brands.selectedProp = null;
                    // 给品牌添加一个品牌数据
                    res.result.brands.unshift({ id: null, name: '全部' })


                    // 给规格的每一项都添加一个
                    // 是否选中和一个空白的全部数据
                    res.result.saleProperties.forEach(items => {
                        items.selectedProp = null;
                        items.properties.unshift({ id: null, name: '全部' })
                    })


                    // 将数据给一个变量
                    SubCate.value = res.result;

                    // 数据赋值成功
                    subFalge.value = false;
                })
            }

        }, { immediate: true })

        return { SubCate, subFalge }
    }












}
</script>



<style scoped lang='less'>
.xtx-skeleton {
    padding: 10px 0;
}


// 筛选区
.sub-filter {
    background: #fff;
    padding: 25px;

    .item {
        display: flex;
        line-height: 40px;

        .head {
            width: 80px;
            color: #999;
        }

        .body {
            flex: 1;

            a {
                margin-right: 36px;
                transition: all .3s;
                display: inline-block;

                &.active,
                &:hover {
                    color: @xtxColor;
                }
            }
        }
    }
}
</style>