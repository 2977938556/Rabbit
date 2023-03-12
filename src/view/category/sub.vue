<template>
    <div class="sub-category">
        <div class="container">
            <!-- 面包屑 -->
            <SubBread />

            <!-- 筛选区 -->
            <SubFilter @filter-change="changeFilter" />

            <!-- 结果 排序 列表  区域 -->
            <div class="goods-list">
                <SubSort @sort-change="changeSort" />
                <ul>
                    <li v-for="item in goodsList" :key="item.id">
                        <GoodsItem :goods="item" />
                    </li>
                </ul>


                <!-- 加载数据 -->
                <XtxinfiniteLoding @infinite="getData" :loading="loading" :finished="finished" />
            </div>
        </div>
    </div>
</template>
<script>
// 面包屑
import SubBread from './components/sub-bread.vue'

// 筛选组件
import SubFilter from './components/sub-filter.vue'

//排序组件 
import SubSort from './components/sub-store.vue'




import { ref, watch } from 'vue'
import { findSubCategoryGoods } from '@/api/sub.js'
import { useRoute } from 'vue-router'

export default {
    name: 'SubCategory',
    components: { SubBread, SubFilter, SubSort },
    setup() {
        let route = useRoute();

        // 我们需要查询参数 比如当前的二级类目的id  一次查多少条数据 查第几页数据
        let loading = ref(false)// 控制是否在加载  false 代表可以加载
        let finished = ref(false)// 控制是还有数据 false代表还有数据

        // 无限加载的查询参数
        let reqParams = {
            page: 1,
            pageSize: 20
        }

        // 获取的数据
        let goodsList = ref([])

        // 无限数据加载方法
        let getData = () => {
            // 一调用这个方法就需要显示出加载中
            loading.value = true;
            // 添加查询的id数据
            reqParams.categoryId = route.params.id;
            // 调用获取数据
            findSubCategoryGoods(reqParams).then(({ result }) => {
                // 判断是否有数据 有数据就添加到数据中
                if (result.items.length) {
                    goodsList.value.push(...result.items);

                    // 数据成功加载后将加载状态修改为 fasle
                    loading.value = false;

                    // 加载成功后需要将page 加1
                    reqParams.page++


                } else {
                    // 这里是没有数据的情况下
                    // 修改为真代表以及没有数据 并显示相应的提示
                    finished.value = true;
                }
                loading.value = false;
            })
        }

        // 由于点击其他的二级菜单的数据会出问题所以需要监听
        watch(() => route.params.id, (newValue) => {
            // 这里只判断是否是只在二级菜单下的
            if (newValue && (`/category/sub/${newValue}` == route.path)) {
                // 清空数据列表
                goodsList.value = [];
                // 查询参数需要重新确定
                reqParams = {
                    page: 1,
                    pageSize: 20
                }
                finished.value = false
            }
        })


        //  排序操作
        const changeSort = (sortParams) => {
            //  这里是设置 合并参数
            reqParams = { ...reqParams, ...sortParams }
            // 初始化页码数
            reqParams.page = 1
            // 清空数据
            goodsList.value = []
            // 修改没有数据为 false；
            finished.value = false
            getData()
        }

        // 筛选条件
        let changeFilter = (filterParams) => {
            //  这里是设置 合并参数
            reqParams = { ...reqParams, ...filterParams }
            // 初始化页码数
            reqParams.page = 1
            // 清空数据
            goodsList.value = []
            // 修改没有数据为 false；
            finished.value = false
            getData()
        }








        return { getData, goodsList, loading, finished, changeSort, changeFilter }



    }
}
</script>
<style scoped lang='less'>
.goods-list {
    background: #fff;
    padding: 0 25px;
    margin-top: 25px;

    ul {
        display: flex;
        flex-wrap: wrap;
        padding: 0 5px;

        li {
            margin-right: 20px;
            margin-bottom: 20px;

            &:nth-child(5n) {
                margin-right: 0;
            }
        }
    }
}
</style>