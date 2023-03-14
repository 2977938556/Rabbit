<template>
    <div class="goods-tabs">
        <!--  这个是切换组件的按钮 -->
        <nav>
            <a :class="{ active: tabChange === 'ProductDetails' }" href="javascript:;"
                @click="tabChange = 'ProductDetails'">商品详情</a>
            <a :class="{ active: tabChange === 'GoodsComment' }" href="javascript:;"
                @click="tabChange = 'GoodsComment'">商品评价<span>(500+)</span></a>
        </nav>

        <!-- 商品 和 评论相互切换 -->
        <component :is="tabChange"></component>
    </div>
</template>

<script>
import { ref } from 'vue'

// 这个是详情组件
import ProductDetails from './goods-ProductDetails.vue'
// 这个是评论组件
import GoodsComment from './goods-comment.vue'



export default {
    // 商品详情组件1评论和详情相互切换
    name: "GoodsTbas",
    components: {
        ProductDetails,
        GoodsComment
    },
    setup() {

        // 这个是设置返回
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