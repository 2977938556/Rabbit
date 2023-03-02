<template>
    <div class="home-new">
        <HomePanel title="新鲜好物" sub-title="新鲜出炉 品质靠谱">
            <!-- 插入默右侧按钮的内容 -->
            <template #right>
                <XtxMore />
            </template>

            <!-- 默认插槽内容 -->
            <ul class="goods-list">
                <li v-for="item in newMore" :key="item">
                    <RouterLink :to="`/category/${item.id}`">
                        <img :src="item.picture" alt="">
                        <p class="name ellipsis">{{ item.name }}</p>
                        <p class="price">&yen;{{ item.price }}</p>
                    </RouterLink>
                </li>
            </ul>


        </HomePanel>

    </div>
</template>



<script>
// 获取新鲜好物的接口
import { findNew } from '@/api/home.js';

// 导入布局组件
import HomePanel from '@/view/home/components/home-panel.vue';
import { ref } from 'vue';

export default {
    name: "HomeNew",
    setup() {

        // 产品数据
        let newMore = ref([]);

        findNew().then(res => {
            console.log(res.result)
            newMore.value = res.result;
        })



        return { newMore }



    },
    components: { HomePanel }
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