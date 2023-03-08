<template>
    <div>
        <!-- 筛选区 -->
        <div class="sub-filter" v-if="SubCate && !subFalge">
            <!-- 品牌区域 -->
            <div class="item">
                <div class="head">品牌：</div>
                <div class="body">
                    <!--  将品牌数据传递回去 -->
                    <a href="javascript:  " @click="subChangeBrand(bitem.id)"
                        :class="{ active: SubCate.brands.selectedProp == bitem.id }" v-for="bitem in SubCate.brands"
                        :key="bitem.id">{{ bitem.name }}</a>
                </div>
            </div>

            <!-- 筛选区域 -->
            <div class="item" v-for="item in SubCate.saleProperties" :key="item.id">
                <div class="head">{{ item.name }}</div>
                <div class="body">
                    <a href="javascript:  " @click="subChangeProperties(item, pitem.id)"
                        :class="{ active: item.selectedProp == pitem.id }" v-for="pitem in item.properties"
                        :key="pitem.id">{{
                            pitem.name }}</a>
                </div>
            </div>
        </div>

        <!-- 加载区域 -->
        <div v-else class="sub-filter">
            <XtxSkeleton class="item" width="800px" height="40px" />
            <XtxSkeleton class="item" width="800px" height="40px" />
            <XtxSkeleton class="item" width="600px" height="40px" />
            <XtxSkeleton class="item" width="600px" height="40px" />
            <XtxSkeleton class="item" width="600px" height="40px" />
        </div>
    </div>
</template>



<script>
import { findSubCategoryFilter } from '@/api/sub.js'


import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'

export default {
    name: 'SubFilter',
    setup(props, { emit }) {

        let route = useRoute()
        // 筛选的数据
        let SubCate = ref(null)

        // 判断加载的
        let subFalge = ref(false)

        watch(() => route.params.id, (newVal) => {
            // 判断是否是在当前路由及数据是否变化
            if (newVal && `/category/sub/${newVal}` == route.path) {
                // 发送请携带id 
                findSubCategoryFilter(newVal).then(res => {

                    // 数据加载状态 修改为true
                    subFalge.value = true

                    // 给品牌数据添加一个判断是否选中的
                    res.result.brands.selectedProp = null

                    // 给品牌添加一个品牌数据
                    res.result.brands.unshift({ id: null, name: '全部' })

                    // 给规格的每一项都添加一个
                    // 是否选中和一个空白的全部数据
                    res.result.saleProperties.forEach(items => {
                        items.selectedProp = null
                        items.properties.unshift({ id: null, name: '全部' })
                    })


                    // 将数据给一个变量
                    SubCate.value = res.result

                    // 数据赋值成功
                    subFalge.value = false
                })
            }

        }, { immediate: true })

        // 整合 筛选的 数据
        let subParams = () => {
            // 整合数据的对象
            let obj = { brandId: null, attrs: [] }
            // 设置品牌数据
            obj.brandId = SubCate.value.brands.selectedProp
            // 设置筛选数据
            SubCate.value.saleProperties.forEach(item => {
                // 这里判断是否有值 如果有那么就进行数据遍历
                if (item.selectedProp) {
                    // 这里是遍历出被点击的筛选条件
                    let poro = item.properties.find(pitem => pitem.id == item.selectedProp)
                    // 这里是每次将参数压入 obj里面的数据组
                    // 这里判断一下是否有数据
                    if (poro && poro.id) {
                        obj.attrs.push({ groupName: item.name, propertyName: poro.name })
                    }

                }
            })
            return obj
        }



        // 点击设置品牌【点击品牌按钮】
        let subChangeBrand = (vals) => {
            // 判断当前点击品牌是否是已经被点击过的 如果是就阻止
            if (SubCate.value.brands.selectedProp == vals) return

            // 否则修改品牌的数据为当前点击的id
            SubCate.value.brands.selectedProp = vals

            // 调用自定义函数将数据传递给调用者
            emit("filter-change", subParams())
        }

        // 点击设置筛选的参数 【点击筛选的参数】
        let subChangeProperties = (subitem, id) => {
            // 判断当前点击的筛选条件是否已经被点击过了，如果被点击过了那么就阻止
            if (subitem.selectedProp == id) return

            // 否则就修改筛选条件
            subitem.selectedProp = id
            // 调用自定义函数将数据传递给调用者
            emit("filter-change", subParams())
        }





        return { SubCate, subFalge, subChangeBrand, subChangeProperties }
    }












}
</script>



<style scoped lang='less'>
.xtx-skeleton {
    padding: 10px 0;
}


// 筛选区
.sub-filter {
    background: #fff;
    padding: 25px;

    .item {
        display: flex;
        line-height: 40px;

        .head {
            width: 80px;
            color: #999
        }

        .body {
            flex: 1;

            a {

                margin-right: 36px;
                transition: all .3s;
                display: inline-block;

                &.active,
                &:hover {
                    color: @xtxColor
                }
            }
        }
    }
}
</style>