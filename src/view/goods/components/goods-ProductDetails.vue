<template>
    <div class="goods-detail">
        <!-- 属性 -->
        <!-- 渲染属性 -->
        <ul class="attrs">
            <li v-for="item in goods.details.properties" :key="item.name">
                <span class="dt">{{ item.name }}</span>
                <span class="dd">{{ item.value }}</span>
            </li>
        </ul>
        <!-- 渲染图片 -->
        <img v-for="(item, index) in goods.mainPictures" :key="index" :src="item">
    </div>
</template>
<script>
import { inject } from 'vue'
export default {
    // 这个组件是用于展示 商品详情的
    name: 'ProductDetails',
    setup() {

        // 获取商品的数据
        let goods = inject("goods")
        return { goods }
    }

}
</script>



<style scoped lang="less">
.goods-detail {
    padding: 40px;

    .attrs {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 30px;

        li {
            display: flex;
            margin-bottom: 10px;
            width: 50%;

            .dt {
                width: 100px;
                color: #999;
            }

            .dd {
                flex: 1;
                color: #666;
            }
        }
    }

    >img {
        width: 100%;
    }
}
</style>