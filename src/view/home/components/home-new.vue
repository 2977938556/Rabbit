<template>
    <div class="home-new" ref="target">
        <HomePanel title="新鲜好物" sub-title="新鲜出炉 品质靠谱">
            <!-- 插入默右侧按钮的内容 -->
            <template #right>
                <XtxMore />
            </template>
            <Transition name="fade">
                <!-- 默认插槽内容 -->
                <ul class="goods-list" v-if="newMore.length">
                    <li v-for="item in newMore" :key="item">
                        <RouterLink :to="`/category/${item.id}`">
                            <img v-lazy="item.picture" alt="">
                            <p class="name ellipsis">{{ item.name }}</p>
                            <p class="price">&yen;{{ item.price }}</p>
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
import { findNew } from '@/api/home.js';

// 导入布局组件
import HomePanel from '@/view/home/components/home-panel.vue';


// 导入骨架组件
import HomeSkeleton from '@/view/home/components/home-skeleton.vue';



// 导入数据懒加载
import { Datalazyloading } from '@/hooks/index.js'




import { ref } from 'vue';




export default {
    name: "HomeNew",
    setup() {

        // 产品数据
        let newMore = ref([]);

        //  这个方法会返回两个东西 
        // result :返回的是一个获取的数据 
        // targt :绑定需要监听的对象 
        let { result, target } = Datalazyloading(findNew)

        return { newMore: result, target }



    },
    components: { HomePanel, HomeSkeleton }
}



</script>




<style scoped lang="less">
.goods-list {
    display: flex;
    justify-content: space-between;
    height: 406px;

    li {
        width: 306px;
        height: 406px;
        background: #f0f9f4;
        .hoverShadow();

        img {
            width: 306px;
            height: 306px;
        }

        p {
            font-size: 22px;
            padding: 12px 30px 0 30px;
            text-align: center;
        }

        .price {
            color: @priceColor;
        }
    }
}
</style>