<template>
    <div class='xtx-goods-page' v-if="goods">
        <div class="container">
            <!-- 面包屑 -->
            <XtxBread>
                <XtxBreadItem to="/">首页</XtxBreadItem>
                <!-- 这里由于数据乱了所以需要手动输入 -->
                <XtxBreadItem :to="goods.categories[1].id">{{ goods.categories[1].name }}</XtxBreadItem>
                <XtxBreadItem :to="goods.categories[0].id">{{ goods.categories[0].name }}</XtxBreadItem>
                <Transition name="fade-right">
                    <XtxBreadItem>{{ goods.name }}</XtxBreadItem>
                </Transition>


            </XtxBread>







            <!-- 商品信息 -->
            <div class="goods-info">
                <div class="media">
                    <GoodsImage :images="goods.mainPictures" />
                </div>
                <div class="spec">2</div>
            </div>




            <!-- 商品推荐 -->
            <GoodsRelevant />




            <!-- 商品详情 -->
            <div class="goods-footer">
                <div class="goods-article">
                    <!-- 商品+评价 -->
                    <div class="goods-tabs"></div>
                    <!-- 注意事项 -->
                    <div class="goods-warn"></div>
                </div>
                <!-- 24热榜+专题推荐 -->
                <div class="goods-aside"></div>
            </div>


            <!-- <p v-if="goods"> {{ categoriesList }}</p> -->




        </div>
    </div>
</template>
  
<script>
// 推荐商品组件
import GoodsRelevant from './components/goods-relevant.vue'


// 商品展示区域
import GoodsImage from './components/goods-image.vue'



// 导入获取数据
import { findGoods } from '@/api/product.js'
import { useRoute } from 'vue-router'
import { computed, nextTick, ref, watch } from 'vue'


export default {
    name: 'XtxGoodsPage',
    components: { GoodsRelevant, GoodsImage },

    //定义获取商品详情API函数
    //在组件setup中获取商品详情数据
    //定义一个useXxx函数处理数据





    setup() {
        let route = useRoute();

        // 产品详情数据
        let goods = ref(null);


        //  这里是获取数据
        let getGoods = () => {
            let goodsId = route.params.id;
            findGoods(goodsId).then(({ result }) => {
                goods.value = null
                // 这里是在每次点击不同商品的时候重新在渲染组件后赋值  使用了v-if的组件先销毁再赋值然后再创建 
                nextTick(() => {
                    goods.value = result
                })
                console.log(result)
            })
        }





        // 这里是监听路由的变化
        watch(() => route.params.id, (newValue) => {
            if (newValue && `/product/${newValue}` === route.path) {
                getGoods();
            }
        }, { immediate: true })






        return { goods }
    }





}
</script>
  















<style scoped lang='less'>
.goods-info {
    min-height: 600px;
    background: #fff;

    min-height: 600px;
    background: #fff;
    display: flex;

    .media {
        width: 580px;
        height: 600px;
        padding: 30px 50px;
    }

    .spec {
        flex: 1;
        padding: 30px 30px 30px 0;
    }
}

.goods-footer {
    display: flex;
    margin-top: 20px;

    .goods-article {
        width: 940px;
        margin-right: 20px;
    }

    .goods-aside {
        width: 280px;
        min-height: 1000px;
    }
}

.goods-tabs {
    min-height: 600px;
    background: #fff;
}

.goods-warn {
    min-height: 600px;
    background: #fff;
    margin-top: 20px;
}
</style>