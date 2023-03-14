<template>
    <div class="goods-relevant">
        <div class="header">
            <i class="icon" />
            <span class="title">同类商品推荐</span>
        </div>
        <!-- 此处使用改造后的xtx-carousel.vue -->
        <XtxCarousel :sliders="releaveData" :autoPlay="false" />


    </div>
</template>
  
<script>

// 导入猜你喜欢数据
import { findRelGoods } from '@/api/product.js'
import { ref } from 'vue'


export default {
    // 同类推荐，猜你喜欢 组件
    name: 'GoodsRelevant',
    props: {
        goodsid: {
            type: String,
            default: ''
        }
    },


    setup(props) {
        // 获取数据 需要传递id 和需要展示多少条
        // 需要改造轮播图
        let releaveData = ref([]);


        // 需要处理数据
        findRelGoods(props.goodsid, 16).then(({ result }) => {
            // 设置中长度
            // 获取多少页面的数据
            let maxLength = 4
            let powLenght = Math.ceil(result.length / maxLength)

            for (let i = 0; i < powLenght; i++) {
                releaveData.value.push(result.slice(maxLength * i, maxLength * (i + 1)))
            }
        })


        return { releaveData }
    }




}
</script>
  
<style scoped lang='less'>
.goods-relevant {
    background: #fff;
    min-height: 460px;
    margin-top: 20px;

    .header {
        height: 80px;
        line-height: 80px;
        padding: 0 20px;

        .title {
            font-size: 20px;
            padding-left: 10px;
        }

        .icon {
            width: 16px;
            height: 16px;
            display: inline-block;
            border-top: 4px solid @xtxColor;
            border-right: 4px solid @xtxColor;
            box-sizing: border-box;
            position: relative;
            transform: rotate(45deg);

            &::before {
                content: "";
                width: 10px;
                height: 10px;
                position: absolute;
                left: 0;
                top: 2px;
                background: lighten(@xtxColor, 40%);
            }
        }
    }
}



//  推荐商品样式覆盖
:deep(.xtx-carousel) {
    height: 380px;

    .carousel {
        &-indicator {
            bottom: 30px;

            span {
                &.active {
                    background: @xtxColor;
                }
            }
        }

        &-btn {
            top: 110px;
            opacity: 1;
            background: rgba(0, 0, 0, 0);
            color: #ddd;

            i {
                font-size: 30px;
            }
        }
    }
}
</style>