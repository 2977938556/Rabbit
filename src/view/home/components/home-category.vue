<template>
    <div class='home-category'>
        <!-- {{ list }} -->
        <ul class="menu">

            <li v-for="item in list" :key="item.id || item.name">
                <RouterLink :to="`/category/${item.id}`">{{ item.name }}</RouterLink>
                <template v-if="item.children">
                    <RouterLink :to="`/category/sub/${item.id}`" v-for="citem in item.children"
                        :key="citem.id || citem.name">{{ citem.name }}
                    </RouterLink>
                </template>
            </li>
        </ul>
    </div>
</template>
  
<script>
import { computed, reactive } from 'vue';
import { useStore } from 'vuex'
export default {
    name: 'HomeCategory',

    setup() {
        let store = useStore();

        // 这里的意思就是获取list列表数据
        // 如何返回一个全新的数据 每个分类有两个子分类
        // 需要puhs 进一个品牌数据
        let brand = reactive({
            id: "brand",
            name: "品牌",
            children: [{ id: 'brand-children', name: "品牌推荐" }]
        })


        // 拼装数据
        let list = computed(function () {
            let menuList = store.state.category.list.map(item => {
                return {
                    id: item.id,
                    name: item.name,
                    // 防止初始化没有children的时候调用slice函数报错
                    children: item.children && item.children.slice(0, 2)
                }
            })
            menuList.push(brand)
            return menuList
        })




        return { list }
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

            &:hover {
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
}
</style>