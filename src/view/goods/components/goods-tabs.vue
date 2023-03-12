<template>
    <div class="goods-tabs">
        <nav>
            <a :class="{ active: tabChange === 'ProductDetails' }" href="javascript:;"
                @click="tabChange = 'ProductDetails'">商品详情</a>
            <a :class="{ active: tabChange === 'reviewsGoods' }" href="javascript:;"
                @click="tabChange = 'reviewsGoods'">商品评价<span>(500+)</span></a>
        </nav>



        <component :is="tabChange"></component>




    </div>
</template>

<script>
import { ref } from 'vue'


import ProductDetails from './goods-ProductDetails.vue'
import reviewsGoods from './goods-reviewsGoods.vue'





export default {
    name: "GoodsTbas",
    components: {
        ProductDetails,
        reviewsGoods
    },
    setup() {
        let tabChange = ref('ProductDetails')


        return { tabChange }

    }
}




</script>


<style scoped lang="less">
.goods-tabs {
    min-height: 600px;
    background: #fff;

    nav {
        height: 70px;
        line-height: 70px;
        display: flex;
        border-bottom: 1px solid #f5f5f5;

        a {
            padding: 0 40px;
            font-size: 18px;
            position: relative;

            >span {
                color: @priceColor;
                font-size: 16px;
                margin-left: 10px;
            }

            &:first-child {
                border-right: 1px solid #f5f5f5;
            }

            &.active {
                &::before {
                    content: "";
                    position: absolute;
                    left: 40px;
                    bottom: -1px;
                    width: 72px;
                    height: 2px;
                    background: @xtxColor;
                }
            }
        }
    }
}
</style>