<template>
    <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem v-if="SubBrand.top" :to="`/category/${SubBrand.top.id}`">{{ SubBrand.top.name }}</XtxBreadItem>
        <Transition name="fade-right" mode="out-in">
            <XtxBreadItem v-if="SubBrand.sub">{{ SubBrand.sub.name }}</XtxBreadItem>
        </Transition>
    </XtxBread>
</template>
<script>
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { computed, ref } from 'vue'
export default {
    name: 'SubBread',

    setup() {
        // 01 获取路由的id 通过计算属性计算出面包屑的二三及的数据
        let store = useStore();
        let route = useRoute();


        // 02 设置面包屑的数据
        let SubBrand = computed(() => {
            let brand = {};
            // 这里是在循环第一层级的数据
            store.state.category.list.forEach(item => {
                // 这里判断是否有二级的数据 如果有就循环
                if (item && item.children) {
                    //  这里循环二级的数据
                    item.children.forEach(sitem => {
                        // 这里判断是否等于路由上的id
                        if (sitem.id == route.params.id) {

                            //  这里是设置第一层级路由的数据
                            brand.top = { id: item.id, name: item.name }
                            //  这里是设置第二层级的路由的数据
                            brand.sub = { id: sitem.id, name: sitem.name }
                        }
                    })
                }

            })

            if (Object.getOwnPropertyNames(brand).length === 0) {
                return {}
            }

            return brand;
        })


        return { SubBrand }

    }

}
</script>
<style scoped lang="less"></style>