<template>
    <ul class="app-header-nav">
        <li class="home">
            <RouterLink to="/">首页</RouterLink>
        </li>
        <li v-for="item in classIfy" :key="item.id" @mouseenter="showCate(item)" @mouseleave="hideCate(item)"
            @click="hideCate(item)">
            <router-link :to="`/category/${item.id}`">{{ item.name }}</router-link>
            <div class="layer" :class="{ open: item.open }">
                <ul>
                    <li v-for="citem in item.children" :key="citem.id" @click="hideCate(item)">
                        <router-link :to="`/category/sub/${citem.id}`">
                            <img :src="citem.picture" alt="">
                            <p>{{ citem.name }}</p>
                        </router-link>
                    </li>
                </ul>
            </div>
        </li>
    </ul>
</template>



<script>

import { useStore } from 'vuex';
import { computed } from 'vue'

export default {
    setup() {
        let store = useStore();

        // 这里返回的是一个获取的分类列表
        let classIfy = computed(() => {
            return store.state.category.list;
        })


        // 显示
        let showCate = (item) => {
            store.commit('category/SHOWCATE', item.id)
        }

        // 隐藏
        let hideCate = (item) => {
            store.commit('category/HIDECATE', item.id)
        }


        return { classIfy, showCate, hideCate }


    },
}
</script>



<style scoped lang="less">
.app-header-nav {
    width: 820px;
    display: flex;
    justify-content: space-around;
    padding-left: 40px;
    position: relative;
    z-index: 998;

    >li {
        margin-right: 40px;
        width: 38px;
        text-align: center;

        >a {
            font-size: 16px;
            line-height: 32px;
            height: 32px;
            display: inline-block;
        }

        &:hover {
            >a {
                color: @xtxColor;
                border-bottom: 1px solid @xtxColor;
            }


        }
    }
}

.layer {
    &.open {
        height: 132px;
        opacity: 1;
    }

    width: 1240px;
    background-color: #fff;
    position: absolute;
    left: -200px;
    top: 56px;
    height: 0;
    overflow: hidden;
    opacity: 0;
    box-shadow: 0 0 5px #ccc;
    transition: all .2s .1s;

    ul {
        display: flex;
        flex-wrap: wrap;
        padding: 0 70px;
        align-items: center;
        height: 132px;

        li {
            width: 110px;
            text-align: center;

            img {
                width: 60px;
                height: 60px;
            }

            p {
                padding-top: 10px;
            }

            &:hover {
                p {
                    color: @xtxColor;
                }
            }
        }
    }
}
</style>