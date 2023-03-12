<template>
    <div class="goods-hot">
        <h3>{{ title }}</h3>
        <GoodsItem v-for="item in goodsHotList" :goods="item" :key="item" />
    </div>
</template>
<script>
import { computed, ref, inject } from 'vue'
import { findHotGoods } from '@/api/product.js'
export default {
    name: 'GoodsHot',
    props: {
        type: {
            type: [String, Number],
            default: 1
        }
    },
    setup(props) {

        // 得到父级传递的包装对象
        let goods = inject('goodsList')

        let typeTitle = { 1: '24小时热榜', 2: '每周周热榜', 3: '每月热榜' }


        let title = computed(() => {
            return typeTitle[props.type]
        })



        // 通过id 发送请求获取数据
        let goodsHotList = ref([])
        findHotGoods(goods.value.id, props.type, 3).then(({ result }) => {
            goodsHotList.value = result
        })








        return { title, goodsHotList }
    }

}
</script>




<style scoped lang="less">
.goods-hot {
    h3 {
        height: 70px;
        background: @helpColor;
        color: #fff;
        font-size: 18px;
        line-height: 70px;
        padding-left: 25px;
        margin-bottom: 10px;
        font-weight: normal;
    }

    ::v-deep .goods-item {
        background: #fff;
        width: 100%;
        margin-bottom: 10px;

        img {
            width: 200px;
            height: 200px;
        }

        p {
            margin: 0 10px;
        }

        &:hover {
            transform: none;
            box-shadow: none;
        }
    }
}
</style>