<template>
    <div class='xtx-carousel' @mouseenter="stop" @mouseleave="autoImg">
        <ul class="carousel-body">
            <li class="carousel-item" v-for="(item, index) in sliders" :key="item.id" :class="{ fade: i == index }">


                <!-- 这里需要判断是图片还是数据 因为传递图片的数据是有图片数据 而猜你喜欢没有 -->
                <template v-if="item.imgUrl">
                    <RouterLink :to=item.hrefUrl>
                        <img :src="item.imgUrl" alt="">
                    </RouterLink>
                </template>

                <!-- 是猜你喜欢就到这里渲染 -->
                <template v-else>
                    <div class="slider">
                        <RouterLink v-for="goods in item" :key="goods.id" :to="`/product/${goods.id}`">
                            <img :src="goods.picture" alt="">
                            <p class="name ellipsis">{{ goods.name }}</p>
                            <p class="price">&yen;{{ goods.price }}</p>
                        </RouterLink>
                    </div>
                </template>



            </li>
        </ul>
        <a href="javascript:;" class="carousel-btn prev" @click="onchanges(i = i - 1)"><i
                class="iconfont icon-angle-left"></i></a>
        <a href="javascript:;" class="carousel-btn next" @click="onchanges(i = i + 1)"><i
                class="iconfont icon-angle-right"></i></a>
        <div class="carousel-indicator">
            <span v-for="(items, index) in sliders.length" :key="items" @click="i = index"
                :class="{ active: index == i }"></span>
        </div>
    </div>
</template>
  
<script>
import { ref, watch } from 'vue'
export default {
    name: 'XtxCarousel',
    props: {
        // 数据
        sliders: {
            type: Array,
            default: () => [],
        },
        // 自动播放
        autoPlay: {
            type: Boolean,
            default: true,
        },
        duration: {
            type: Number,
            default: 2000,
        }

    },


    setup(props) {


        // 自动播放
        // 有设置自动播放那么就

        // 设置显示哪张图片
        let i = ref(0);
        // 设置定时器
        let time = null;



        //01: 设置图片自动轮播
        let autoPlayFn = () => {
            // 每次执行的时候 清空定时器
            clearInterval(time)
            time = setInterval(() => {
                // 这里是先添加值[再进行判断]
                i.value++;
                // 如果 索引值大于了数据的长度那么就需要回归默认值
                if (i.value >= props.sliders.length) {
                    i.value = 0;
                }
            }, props.duration)
        }

        //02: 监听什么时候设置自动播放
        // 这里监听什么时候开始轮播 并且是有携带条件的
        // 需要有数据 需要设置自动轮播
        watch(() => props.sliders, (neval) => {
            if (props.sliders.length && props.autoPlay) {
                autoPlayFn();
            }


        }, {
            // 这是立即执行
            immediate: true,
        })


        //03: 鼠标移入移出
        // 条件 :如果设置了自动播放那么就可以设置成鼠标移入自动停止
        let stop = () => {
            if (props.autoPlay) {
                // 清空数据
                clearInterval(time);
            }
        }



        //04: 鼠标移出 
        // 条件 :  如果有自动播放,并且有数据那么就设置自动播放
        let autoImg = () => {
            if (props.sliders.length && props.autoPlay) {
                autoPlayFn();
            }
        }



        //05:设置鼠标点击上下切换开关
        // 条件 : 点击下一张不能超出了数据的长度 [5]
        // 条件2: 点击上一张不能小于第一张的长度  [0]
        let onchanges = (indexs) => {
            // 条件1
            if (indexs >= props.sliders.length) {
                i.value = 0;
                return
            }

            // 条件2
            if (indexs < 0) {
                i.value = props.sliders.length - 1;
                return;
            }

        }



        return { i, stop, autoImg, onchanges }
    }
}
</script>
<style scoped lang="less">
.xtx-carousel {
    width: 100%;
    height: 100%;
    min-width: 300px;
    min-height: 150px;
    position: relative;

    .carousel {
        &-body {
            width: 100%;
            height: 100%;
        }

        &-item {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            opacity: 0;
            transition: opacity 0.5s linear;

            &.fade {
                opacity: 1;
                z-index: 1;
            }

            img {
                width: 100%;
                height: 100%;
            }
        }

        &-indicator {
            position: absolute;
            left: 0;
            bottom: 20px;
            z-index: 2;
            width: 100%;
            text-align: center;

            span {
                display: inline-block;
                width: 12px;
                height: 12px;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 50%;
                cursor: pointer;

                ~span {
                    margin-left: 12px;
                }

                &.active {
                    background: #fff;
                }
            }
        }

        &-btn {
            width: 44px;
            height: 44px;
            background: rgba(0, 0, 0, .2);
            color: #fff;
            border-radius: 50%;
            position: absolute;
            top: 228px;
            z-index: 2;
            text-align: center;
            line-height: 44px;
            opacity: 0;
            transition: all 0.5s;

            &.prev {
                left: 20px;
            }

            &.next {
                right: 20px;
            }
        }
    }

    &:hover {
        .carousel-btn {
            opacity: 1;
        }
    }
}



// 轮播商品
.slider {
    display: flex;
    justify-content: space-around;
    padding: 0 40px;

    >a {
        width: 240px;
        text-align: center;

        img {
            padding: 20px;
            width: 230px !important;
            height: 230px !important;
        }

        .name {
            font-size: 16px;
            color: #666;
            padding: 0 40px;
        }

        .price {
            font-size: 16px;
            color: @priceColor;
            margin-top: 15px;
        }
    }
}
</style>