<template>
    <div class="sub-category">
        <div class="container">
            <!-- 面包屑 -->
            <SubBread />

            <!-- 筛选区 -->
            <SubFilter />


            <!-- 复选框 -->

            <!-- 结果 排序 列表  区域 -->
            <div class="goods-list">
                <SubSort></SubSort>
            </div>



        </div>
    </div>
</template>
<script>
// 面包屑
import SubBread from './components/sub-bread.vue'

// 筛选组件
import SubFilter from './components/sub-filter.vue'

//排序组件 
import SubSort from './components/sub-store.vue'



import { ref } from 'vue'

export default {
    name: 'SubCategory',
    components: { SubBread, SubFilter, SubSort },
    setup() {

    }
}
</script>
<style scoped lang="less"></style>