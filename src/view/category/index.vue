<template>
    <div class="top-category">
        <!-- 容器 -->
        <div class="container">
            <!-- 面包屑 -->
            <XtxBread>
                <XtxBreadItem to="/">首页</XtxBreadItem>
                <transition name="fade-right" mode="out-in">
                    <XtxBreadItem :key="categoryList.id"> {{ categoryList.name }}</XtxBreadItem>
                </transition>
            </XtxBread>

            <!-- 轮播图 -->
            <XtxCarousel :sliders="sliders" style="min-height:500px;" />

            <!-- 所有二级分类 -->
            <div class="sub-list">
                <h3>全部分类</h3>
                <ul>
                    <li v-for="item in categoryList.children" :key="item">
                        <router-link :to="`/category/sub/${item.id}`">
                            <img :src="item.picture">
                            <p>{{ item.name }}</p>
                        </router-link>
                    </li>
                </ul>
            </div>

            <!-- 分类商品 -->
            <div class="ref-goods" v-for="item in TopList" :key="item.id">
                <div class="head">
                    <h3>- {{ item.name }} -</h3>
                    <p class="tag">温暖柔软，品质之选</p>
                    <XtxMore path="/category/sub" />
                </div>
                <div class="body">
                    <GoodsItem v-for="item in item.goods" :goods="item" :key="item.id" />
                </div>
            </div>



        </div>
    </div>
</template>
<script>
import { computed, ref, watch } from 'vue'
import { findBranner } from '@/api/home.js'
import { findTopCategory } from '@/api/category.js'
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';


export default {
    name: 'TopCategory',
    setup() {
        let store = useStore();
        let route = useRoute();


        //01  这里是获取banner的数据
        let sliders = ref([]);
        findBranner().then(res => {
            sliders.value = res.result;
        })




        //02  这里是面包屑的数据
        // 通过id 然后去vuex中获取数据 通过路由id进行判断
        let categoryList = computed(() => {
            let cate = {};
            // 通过router 的路由参数的id 然后发送请求查找id一样的二级类目
            let item = store.state.category.list.find(item => {
                return item.id == route.params.id;
            });

            // 这里是判读是否有二级类目如果有那么就赋值给cate 否则就返回一个空对象
            if (item) {
                cate = item
            }
            return cate;
        })




        //03 推荐商品类目
        let TopList = ref([]);
        let GetTopCategoryList = () => {
            findTopCategory(route.params.id).then(res => {
                TopList.value = res.result.children
            })
        }


        // 04 这里使用的是监听函数监听路由的变化如果发生变化了那么就会执行获取数据的函数从而导致组件的刷新
        watch(() => route.params.id, (newVal) => {
            //  这里由于是会将二级类目进行发送请求导致请求，所以需要判断一下，
            // 判断是否有改变数据还有是否 拼接的路径是否等于当前路由的路径 
            if (newVal && `/category/${newVal}` == route.path) {
                GetTopCategoryList();
            }
        }, { immediate: true })



        return { sliders, categoryList, TopList }
    }
}
</script>






<style scoped lang="less">
.top-category {
    h3 {
        font-size: 28px;
        color: #666;
        font-weight: normal;
        text-align: center;
        line-height: 100px;
    }

    .sub-list {
        margin-top: 20px;
        background-color: #fff;

        ul {
            display: flex;
            padding: 0 32px;
            flex-wrap: wrap;

            li {
                width: 168px;
                height: 160px;

                a {
                    text-align: center;
                    display: block;
                    font-size: 16px;

                    img {
                        width: 100px;
                        height: 100px;
                    }

                    p {
                        line-height: 40px;
                    }

                    &:hover {
                        color: @xtxColor;
                    }
                }
            }
        }
    }

    .ref-goods {
        background-color: #fff;
        margin-top: 20px;
        position: relative;

        .head {
            .xtx-more {
                position: absolute;
                top: 20px;
                right: 20px;
            }

            .tag {
                text-align: center;
                color: #999;
                font-size: 20px;
                position: relative;
                top: -20px;
            }
        }

        .body {
            display: flex;
            justify-content: flex-start;
            flex-wrap: wrap;
            padding: 0 65px 30px;
        }
    }
}
</style>