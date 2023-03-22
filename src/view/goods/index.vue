<template>
    <div class='xtx-goods-page' v-if="goods">
        <div class="container">
            <!-- 面包屑 -->
            <XtxBread>
                <XtxBreadItem to="/">首页</XtxBreadItem>
                <!-- 这里由于后台数据乱了所以需要手动输入 -->
                <XtxBreadItem :to="goods.categories[1].id">{{ goods.categories[1].name }}</XtxBreadItem>
                <XtxBreadItem :to="goods.categories[0].id">{{ goods.categories[0].name }}</XtxBreadItem>
                <Transition name="fade-right">
                    <XtxBreadItem>{{ goods.name }}</XtxBreadItem>
                </Transition>


            </XtxBread>

            <!--01: 商品信息 -->
            <div class="goods-info">
                <div class="media">
                    <!-- 图片放大镜 轮播图效果 -->
                    <GoodsImage :images="goods.mainPictures" />
                    <!-- 商品销售人气组件 -->
                    <GoodsSales />
                </div>
                <div class="spec">
                    <!-- 商品信息组件 -->
                    <GoodsName :goods="goods" />

                    <!-- sku规格组件 -->
                    <GoodsSku :goods="goods" :skuid="goods.skus.find(item => item.inventory).id"
                        @changeSku="changeSkuchange" />

                    <!-- 商品数量组件 -->
                    <XtxNumbox v-model="count" label="数量" :min="1" :max="goods.inventory" @change="change" />

                    <!-- 加入购物车按钮组件 -->
                    <XtxButton size="middle" type="primary" style="margin-top:10px;">加入购物车</XtxButton>

                </div>
            </div>


            <!--02: 商品推荐 -->
            <GoodsRelevant :goodsid="goods.id" />

            <!-- 商品详情 -->
            <div class="goods-footer">
                <div class="goods-article">
                    <!-- 商品详情+评价 -->
                    <div class="goods-tabs">
                        <!-- 切换栏 -->
                        <GoodsTbas />
                        <!-- 注意事项组件 -->

                    </div>
                    <!-- 注意事项 -->
                    <div class="goods-warn">
                        <GoodsWran />
                    </div>
                </div>
                <!-- 24热榜+专题推荐 -->
                <div class="goods-aside">
                    <GoodsHot type="1" />
                    <GoodsHot type="2" />
                </div>
            </div>

        </div>
    </div>
</template>
  
<script>



// 商品展示区域
import GoodsImage from './components/goods-image.vue'

// sku 组件
import GoodsSku from './components/goods-sku.vue'

// 商品销售组件信息
import GoodsSales from './components/goods-sales.vue'

// 商品详情该组件
import GoodsName from './components/goods-names.vue'

// 推荐商品组件
import GoodsRelevant from './components/goods-relevant.vue'

// 商品详情与评价组件
import GoodsTbas from './components/goods-tabs.vue'

// 热榜组件
import GoodsHot from './components/goods-hot.vue'


// 注意事项组件
import GoodsWran from './components/goods-warn.vue'


// 导入获取数据
import { findGoods } from '@/api/product.js'
import { useRoute } from 'vue-router'
import { nextTick, ref, watch, provide } from 'vue'


export default {
    name: 'XtxGoodsPage',
    components: {
        GoodsRelevant,
        GoodsImage,
        GoodsSales,
        GoodsName,
        GoodsSku,
        GoodsTbas,
        GoodsHot,
        GoodsWran
    },

    //定义获取商品详情API函数
    //在组件setup中获取商品详情数据
    //定义一个useXxx函数处理数据

    setup() {
        let route = useRoute();

        // 产品详情数据
        let goods = ref(null);


        //  这里是获取商品详情数据
        let getGoods = () => {
            let goodsId = route.params.id;

            findGoods(goodsId).then(({ result }) => {
                goods.value = null
                // 这里是在每次点击不同商品的时候重新在渲染组件后赋值  使用了v-if的组件先销毁再赋值然后再创建 
                nextTick(() => {
                    goods.value = result
                })
                // console.log(result)
            })

            // 给子集暴露 商品的数据
            provide('goods', goods)
        }


        // 这里是监听路由的变化 发送id获取数据
        watch(() => route.params.id, (newValue) => {
            if (newValue && `/product/${newValue}` === route.path) {
                getGoods();
            }
        }, { immediate: true })



        // 规格选项 选项选择了那么就需要修改父级的值然后子集也会更着变化
        let changeSkuchange = (val) => {
            console.log("Sku组件传递过来的数据", val)
            if (val.skuId) {
                goods.value.price = val.price;
                goods.value.oldPrice = val.oldPrice;
                goods.value.id = val.skuId;
            }
        }


        // 数量
        let count = ref(1)


        let change = (val) => {
            count.value = val
        }

        return { goods, changeSkuchange, count, change }
    }

    // 下午完成 购物车部分








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