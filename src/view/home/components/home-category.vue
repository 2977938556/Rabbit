<template>
    <div class='home-category' @mouseleave="godsId = ''">
        <!--  分类 -->
        <ul class="menu">
            <li :class="{ active: godsId == item.id }" v-for="item in list" :key="item.id || item.name"
                @mouseenter="godsId = item.id">
                <RouterLink :to="`/category/${item.id}`">{{ item.name }}</RouterLink>
                <template v-if="item.children">
                    <RouterLink :to="`/category/sub/${item.id}`" v-for="citem in item.children"
                        :key="citem.id || citem.name">{{ citem.name }}
                    </RouterLink>
                </template>

                <!--  这里是设置没有数据的时候显示的骨架 -->
                <template v-else>
                    <XtxSkeleton width="60px" height="12px" bg="rgba(255,255,255,0.2)" style="margin-right:5px"
                        :animated="true">
                    </XtxSkeleton>
                    <XtxSkeleton width="60px" height="12px" bg="rgba(255,255,255,0.2)" :animated="true"></XtxSkeleton>
                </template>
            </li>
        </ul>

        <!-- 弹出层 -->
        <div class="layer">

            <h4 v-if="goodsIdList">{{ goodsIdList.id == 'brand' ? "品牌" : "分类" }} <small>根据您的购买或浏览记录推荐</small></h4>

            <!-- 分类子集数据渲染 -->
            <ul v-if="godsId && goodsIdList.goods">
                <li v-for="item in goodsIdList.goods" :key="item.id">
                    <RouterLink :to="`/category/${item.id}`">
                        <img v-lazy="item.picture" alt="">
                        <div class="info">
                            <p class="name ellipsis-2">{{ item.name }}</p>
                            <p class="desc ellipsis">{{ item.desc }}</p>
                            <p class="price"><i>¥</i>{{ item.price }}</p>
                        </div>
                    </RouterLink>
                </li>
            </ul>



            <!--  品牌的子集数据渲染 -->
            <ul v-if="godsId && goodsIdList.brand">
                <li class="brand" v-for="item in goodsIdList.brand" :key="item.id">
                    <RouterLink :to="`/category/${item.id}`">
                        <img v-lazy="item.logo" alt="">
                        <div class="info">
                            <p class="place"><i class="iconfont icon-dingwei"></i>{{ item.place }}</p>
                            <p class="name ellipsis">{{ item.name }}</p>
                            <p class="desc ellipsis-2">{{ item.desc }}</p>
                        </div>
                    </RouterLink>
                </li>
            </ul>





        </div>





    </div>
</template>
  
<script>
import { computed, reactive, ref } from 'vue';
import { useStore } from 'vuex'

// 导入获取首页品牌的数据函数
import { findBrand } from '@/api/home.js'



export default {
    name: 'HomeCategory',

    setup() {
        let store = useStore();



        //  01 左侧分类数据
        // 这里的意思就是获取list列表数据
        // 如何返回一个全新的数据 每个分类有两个子分类
        // 需要puhs 进一个品牌数据
        let brand = reactive({
            id: "brand",
            name: "品牌",
            children: [{ id: 'brand-children', name: "品牌推荐" }],
            brand: []
        })
        // 拼装数据
        let list = computed(function () {
            let menuList = store.state.category.list.map(item => {
                return {
                    id: item.id,
                    name: item.name,
                    // 防止初始化没有children的时候调用slice函数报错
                    children: item.children && item.children.slice(0, 2),
                    goods: item.goods,
                }
            })
            menuList.push(brand)
            return menuList
        })




        // 02 弹出层数据
        // 通过鼠标移入获取的当前分类的id进行获取子数据
        let godsId = ref("");
        //通过id 获取相应分类的数据
        let goodsIdList = computed(() => {
            return list.value.find(item => item.id == godsId.value);
        })




        // 03:品牌数据
        // 异步获取数据,并追加到brand 对象中 ,
        // 渲染的时候需要进行判断是否有brand数据
        findBrand().then(value => {
            brand.brand = value.result;
        })








        return { list, godsId, goodsIdList }
    }





}
</script>




<style scoped lang='less'>
.home-category {
    width: 250px;
    height: 500px;
    background: rgba(0, 0, 0, 0.8);
    position: relative;
    z-index: 99;

    .menu {
        li {
            padding-left: 40px;
            height: 50px;
            line-height: 50px;

            &:hover,
            &.active {
                background: @xtxColor;
            }

            a {
                margin-right: 4px;
                color: #fff;

                &:first-child {
                    font-size: 16px;
                }
            }
        }
    }


    // 弹出层
    .layer {
        width: 990px;
        height: 500px;
        background: rgba(255, 255, 255, 0.8);
        position: absolute;
        left: 250px;
        top: 0;
        display: none;
        padding: 0 15px;

        h4 {
            font-size: 20px;
            font-weight: normal;
            line-height: 80px;

            small {
                font-size: 16px;
                color: #666;
            }
        }

        ul {
            display: flex;
            flex-wrap: wrap;

            li {
                width: 310px;
                height: 120px;
                margin-right: 15px;
                margin-bottom: 15px;
                border: 1px solid #eee;
                border-radius: 4px;
                background: #fff;

                &:nth-child(3n) {
                    margin-right: 0;
                }

                a {
                    display: flex;
                    width: 100%;
                    height: 100%;
                    align-items: center;
                    padding: 10px;

                    &:hover {
                        background: #e3f9f4;
                    }

                    img {
                        width: 95px;
                        height: 95px;
                    }

                    .info {
                        padding-left: 10px;
                        line-height: 24px;
                        width: 190px;

                        .name {
                            font-size: 16px;
                            color: #666;
                        }

                        .desc {
                            color: #999;
                        }

                        .price {
                            font-size: 22px;
                            color: @priceColor;

                            i {
                                font-size: 16px;
                            }
                        }
                    }
                }
            }
        }
    }

    &:hover {
        .layer {
            display: block;
        }
    }




}


//  骨架样式
.xtx-skeleton {
    animation: fade 1s linear infinite alternate;
}

@keyframes fade {
    from {
        opacity: 0.2;
    }

    to {
        opacity: 1;
    }
}
</style>