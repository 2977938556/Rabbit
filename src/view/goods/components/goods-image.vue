<template>
    <div class="goods-image">


        <!-- 大图 -->
        <div v-if="flage" class="large" :style="[{ backgroundImage: `url(${images[currIndex]})` }, lazyerPosition]"></div>



        <!-- 小图 -->
        <div class="middle">
            <img :src="images[currIndex]" alt="" ref="target">
            <!-- 遮罩容器 -->
            <div class="layer" :style="bigPosition" v-if="flage"></div>
        </div>

        <!-- 五张小图 -->
        <ul class="small">
            <li v-for="(img, i) in images" :key="img" :class="{ active: i === currIndex }">
                <img @mouseenter="currIndex = i" :src="img" alt="">
            </li>
        </ul>





    </div>
</template>
<script>
import { reactive, ref, watch } from 'vue'
import { useMouseInElement } from '@vueuse/core'
export default {
    // 这个组件是图片放大镜效果组件 
    name: 'GoodsImage',
    props: {
        images: {
            type: Array,
            default: () => []
        }
    },
    setup(props) {
        const currIndex = ref(0)

        // 是否显示大图
        let flage = ref(false)
        let target = ref(null)


        // 2 黑色遮罩的 left top轴的坐标
        let bigPosition = reactive({
            left: 0,
            top: 0,
        })

        // 3大图的距离
        let lazyerPosition = reactive({ backgroundPositionX: 0, backgroundPositionY: 0 })


        // 使用vueuse/code 获取坐标
        const { elementX, elementY, isOutside } = useMouseInElement(target);

        // 监听
        watch([elementX, elementY, isOutside], (newvalue) => {
            // console.log(elementX.value, elementY.value, isOutside.value)
            // 显示大图
            flage.value = !isOutside.value;



            let pasiton = {
                x: 0, y: 0
            }



            // 这里是判断是否超出距离限制
            if (elementX.value < 100) {
                pasiton.x = 0;
            } else if (elementX.value > 300) {
                pasiton.x = 200;
            } else {
                pasiton.x = elementX.value - 100
            }



            if (elementY.value < 100) {
                pasiton.y = 0;
            } else if (elementY.value > 300) {
                pasiton.y = 200;
            } else {
                pasiton.y = elementY.value - 100
            }


            // 给遮罩赋值
            bigPosition.left = pasiton.x + 'px'
            bigPosition.top = pasiton.y + 'px'

            // 给大图片赋值
            lazyerPosition.backgroundPositionX = -2 * pasiton.x + "px"
            lazyerPosition.backgroundPositionY = -2 * pasiton.y + "px"
        })


        return { currIndex, target, flage, lazyerPosition, bigPosition }
    }
}
</script>
<style scoped lang="less">
.goods-image {
    width: 480px;
    height: 400px;
    position: relative;
    display: flex;
    z-index: 500;

    // 大图

    .large {
        position: absolute;
        top: 0;
        left: 412px;
        width: 400px;
        height: 400px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        background-repeat: no-repeat;
        background-size: 800px 800px;
        background-color: #f8f8f8;
    }

    .middle {
        width: 400px;
        height: 400px;
        background: #ff7c7c;
        position: relative;
        cursor: move;

        // 遮罩容器
        .layer {
            width: 200px;
            height: 200px;
            background: rgba(0, 0, 0, .2);
            left: 0;
            top: 0;
            position: absolute;
        }



    }

    .small {
        width: 80px;

        li {
            width: 68px;
            height: 68px;
            margin-left: 12px;
            margin-bottom: 15px;
            cursor: pointer;

            &:hover,
            &.active {
                border: 2px solid @xtxColor;
            }
        }
    }

}
</style>