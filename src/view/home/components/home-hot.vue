<template>
    <div class="home-new" ref="target">
        <HomePanel title="人气推荐" sub-title="人气爆款 不容错过">
            <!-- 插入默右侧按钮的内容 -->
            <!-- 人气推荐是没有更多选项的 -->
            <!-- <template #right>
                <XtxMore />
            </template> -->

            <Transition name="fade">
                <!-- 默认插槽内容 -->
                <ul class="goods-list" v-if="goods.length">
                    <li v-for="item in goods" :key="item">
                        <RouterLink :to="`/category/${item.id}`">
                            <img v-lazy="item.picture" alt="">
                            <p class="name ellipsis">{{ item.title }}</p>
                            <p class="price desc">{{ item.alt }}</p>
                        </RouterLink>
                    </li>
                </ul>

                <HomeSkeleton v-else />
            </Transition>


        </HomePanel>

    </div>
</template>



<script>
// 获取新鲜好物的接口
import { findHot } from '@/api/home.js';

// 导入布局组件
import HomePanel from '@/view/home/components/home-panel.vue';


// 导入骨架组件
import HomeSkeleton from '@/view/home/components/home-skeleton.vue';


// 导入vueuse/core
import { Datalazyloading } from '@/hooks/index.js'

export default {
    name: "HomeNew",
    setup() {

        let { result, target } = Datalazyloading(findHot);

        return { goods: result, target }

    },
    components: { HomePanel, HomeSkeleton }
}



</script>




<style scoped lang="less">
.goods-list {
    display: flex;
    justify-content: space-between;
    height: 426px;

    li {
        width: 306px;
        height: 406px;
        .hoverShadow();

        img {
            width: 306px;
            height: 306px;
        }

        p {
            font-size: 22px;
            padding-top: 12px;
            text-align: center;
        }

        .desc {
            color: #999;
            font-size: 18px;
        }
    }
}
</style>
