<template>
    <HomePanel title="热门品牌" sub-title="国际经典 品质保证">
        <template v-slot:right>
            <a @click="taggle(-1)" :class="{ disabled: index == 0 }" href="javascript:;"
                class="iconfont icon-angle-left prev"></a>
            <a @click="taggle(1)" :class="{ disabled: index == 1 }" href="javascript:;"
                class="iconfont icon-angle-right next"></a>
        </template>
        <div class="box" ref="target">
            <Transition name="fand">
                <ul v-if="brandList.length" class="list" :style="{ transform: `translateX(${-index * 1240}px)` }">
                    <li v-for="item in brandList" :key="item.id">
                        <RouterLink to="/">
                            <img :src="item.logo" :alt="item.name">
                        </RouterLink>
                    </li>
                </ul>
                <div v-else class="skeleton">
                    <XtxSkeleton class="item" v-for="i in 5" :key="i" animated bg="#e4e4e4" width="240px" height="305px" />
                </div>
            </Transition>
        </div>





    </HomePanel>
</template>

<script>
// 这个组件是热门品牌组件


// 导入布局组件
import HomePanel from '@/view/home/components/home-panel.vue'

// 导入获取数据方法
import { findBrand } from '@/api/home.js'

//导入数据
import { Datalazyloading } from '@/hooks/index.js'




import { ref } from 'vue'


export default {
    name: "HomeBrand",
    components: {
        HomePanel,
    },


    setup() {
        let brandList = ref([]);


        findBrand(10).then(res => {
            brandList.value = res.result;
        })

        let { result, target } = Datalazyloading(() => findBrand(10))

        // 设置上一页和下一页的点击事件
        // 只有 0 和 1
        let index = ref(0);

        let taggle = (indexs) => {
            let indexsSum = index.value + indexs;

            // 这里判断是否小于0和是否大于1
            if (indexsSum < 0 || indexsSum > 1) return

            index.value = indexsSum;
        }

        return { brandList: result, taggle, index, target }
    }


}



</script>




<style scoped lang='less'>
// 骨架样式
.skeleton {
    width: 100%;
    display: flex;

    .item {
        margin-right: 10px;

        &:nth-child(5n) {
            margin-right: 0;
        }
    }
}




.home-panel {
    background: #f5f5f5
}

.iconfont {
    width: 20px;
    height: 20px;
    background: #ccc;
    color: #fff;
    display: inline-block;
    text-align: center;
    margin-left: 5px;
    background: @xtxColor;

    &::before {
        font-size: 12px;
        position: relative;
        top: -2px
    }

    &.disabled {
        background: #ccc;
        cursor: not-allowed;
    }
}

.box {
    display: flex;
    width: 100%;
    height: 345px;
    overflow: hidden;
    padding-bottom: 40px;

    .list {
        width: 200%;
        display: flex;
        transition: all 1s;

        li {
            margin-right: 10px;
            width: 240px;

            &:nth-child(5n) {
                margin-right: 0;
            }

            img {
                width: 240px;
                height: 305px;
            }
        }
    }
}
</style>