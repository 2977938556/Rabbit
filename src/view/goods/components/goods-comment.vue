<template>
    <div class="goods-comment" v-if="goodsList">
        <div class="head">
            <div class="data">
                <p><span>{{ goodsList.salesCount }}</span><span>人购买</span></p>
                <p><span>{{ goodsList.praisePercent }}</span><span>好评率</span></p>
            </div>
            <div class="tags">
                <div class="dt">大家都在说：</div>
                <div class="dd" v-for="(item, i)  in goodsList.tags" :key="item.title">
                    <a href="javascript:;" @click="currgetTage(i, item)" :class="{ active: currentIndex == i }">{{
                        item.title
                    }}({{ item.tagCount }})</a>
                </div>
            </div>
        </div>
        <div class="sort">
            <span>排序：</span>
            <a href="javascript:;" :class="{ active: reqParams.sortField == null }" @click="changeSort(null)">默认</a>
            <a href="javascript:;" :class="{ active: reqParams.sortField == 'praiseCount' }"
                @click="changeSort('praiseCount')">最新</a>
            <a href="javascript:;" :class="{ active: reqParams.sortField == 'createTime' }"
                @click="changeSort('createTime')">最热</a>
        </div>



        <!-- 评论数据 -->
        <div class="list" v-if="appraise">
            <!-- 列表 -->
            <div class="item" v-for="(item, index) in appraise.items" :key=index>
                <div class="user">
                    <img :src="item.member.avatar" alt="">
                    <span>{{ concealUser(item.member.nickname) }}</span>
                </div>
                <div class="body">

                    <!-- 评价星星 -->
                    <div class="score">
                        <i class="iconfont icon-wjx01" v-for="(k) in item.score" :key="k + 'k'"></i>
                        <i class="iconfont icon-wjx02" v-for="(s) in 5 - item.score" :key="s + 's'"></i>
                        <!-- 评价标签 -->
                        <span class="attr">{{ specifications(item.orderInfo.specs) }}</span>
                    </div>
                    <!-- 评价内容 -->
                    <div class="text">{{ item.content }}</div>
                    <!-- 评价图片 -->
                    <template v-if="item.pictures.length">
                        <GoodsImages :pictures="item.pictures" />
                    </template>

                    <div class="time">
                        <span>{{ item.createTime }}</span>
                        <span class="zan"><i class="iconfont icon-dianzan"></i>{{ item.praiseCount }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>



import { inject, reactive, watch } from 'vue'
import { findCommentInfoByGoods, findCommentInfoByAppraise } from '@/api/product.js'
import { ref } from 'vue'


import GoodsImages from './goods-imgage.vue'


export default {
    // 这个是用来做商品评论的租价
    name: 'GoodsComment',
    components: {
        GoodsImages
    },
    setup() {
        let goods = inject('goods')

        let goodsList = ref([])

        // 发送请求获取数据
        findCommentInfoByGoods(goods.value.id).then(({ result }) => {
            result.tags.unshift({ title: "有图", type: "img", tagCount: result.hasPictureCount })
            result.tags.unshift({ title: "全部", type: "all", tagCount: result.evaluateCount })
            goodsList.value = result
        })

        // 控制tag 的点击样式显示   
        let currentIndex = ref(0)

        // 定义筛选条件
        // 筛选条件准备
        const reqParams = reactive({
            page: 1,//第几页
            pageSize: 10,// 每一页显示多少条数据
            hasPicture: null,// 是否有图
            tag: null,// tag 点击的标签数据
            sortField: null// 排序的操作
        })

        // 点击设置筛选条件
        let currgetTage = (i, item) => {

            // 设置样式的状态为当前的
            currentIndex.value = i

            // 如果为全部的情况下
            if (item.type == "all") {
                reqParams.hasPicture = false
                reqParams.tag = null
                //  这里是判断是否是有图的
            } else if (item.type == "img") {
                reqParams.hasPicture = true
                reqParams.tag = null
            } else {
                // 这里判断是否是其他
                reqParams.hasPicture = false
                reqParams.tag = item.title
            }
            // 重置为；1
            reqParams.page = 1
        }

        // 点击排序的操作
        let changeSort = (type) => {
            reqParams.sortField = type
        }
        // 监听参数的变化

        let appraise = ref({})
        watch(reqParams, async (newVal) => {
            let { result } = await findCommentInfoByAppraise(goods.value.id, reqParams.value)
            appraise.value = result
            console.log(appraise.value)

        }, { immediate: true })


        //处理用户名称的隐私
        let concealUser = (name) => {
            return name.slice(0, 1) + name.slice(1, -1).replace(/./g, "*") + name.slice(-1)
        }

        // 处理规格的 数据
        let specifications = (str) => {
            return str.reduce((a, b) => {
                return `${a} ${b.name}：${b.nameValue}`.trim()
            }, "")
        }




        return { goodsList, currentIndex, currgetTage, changeSort, reqParams, appraise, concealUser, specifications }
    }
}
</script>







<style scoped lang="less">
.goods-comment {
    .head {
        display: flex;
        padding: 30px 0;

        .data {
            width: 340px;
            display: flex;
            padding: 20px;

            p {
                flex: 1;
                text-align: center;

                span {
                    display: block;

                    &:first-child {
                        font-size: 32px;
                        color: @priceColor;
                    }

                    &:last-child {
                        color: #999;
                    }
                }
            }
        }

        .tags {
            // flex: 1;
            border-left: 1px solid #f5f5f5;
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;

            .dt {
                font-weight: bold;
                width: 100px;
                text-align: right;
                line-height: 42px;
            }

            .dd {
                flex: 1;
                display: flex;
                flex-wrap: wrap;

                >a {
                    width: 132px;
                    height: 42px;
                    margin-left: 20px;
                    margin-bottom: 20px;
                    border-radius: 4px;
                    border: 1px solid #e4e4e4;
                    background: #f5f5f5;
                    color: #999;
                    text-align: center;
                    line-height: 40px;

                    &:hover {
                        border-color: @xtxColor;
                        background: lighten(@xtxColor, 50%);
                        color: @xtxColor;
                    }

                    &.active {
                        border-color: @xtxColor;
                        background: @xtxColor;
                        color: #fff;
                    }
                }
            }

            &::before {
                display: block;
                content: "";
            }
        }
    }

    .sort {
        height: 60px;
        line-height: 60px;
        border-top: 1px solid #f5f5f5;
        border-bottom: 1px solid #f5f5f5;
        margin: 0 20px;
        color: #666;

        >span {
            margin-left: 20px;
        }

        >a {
            margin-left: 30px;

            &.active,
            &:hover {
                color: @xtxColor;
            }
        }
    }
}



// 列表样式
.list {
    padding: 0 20px;

    .item {
        display: flex;
        padding: 25px 10px;
        border-bottom: 1px solid #f5f5f5;

        .user {
            width: 160px;

            img {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                overflow: hidden;
            }

            span {
                padding-left: 10px;
                color: #666;
            }
        }

        .body {
            flex: 1;

            .score {
                line-height: 40px;

                .iconfont {
                    color: #ff9240;
                    padding-right: 3px;
                }

                .attr {
                    padding-left: 10px;
                    color: #666;
                }
            }
        }

        .text {
            color: #666;
            line-height: 24px;
        }

        .time {
            color: #999;
            display: flex;
            justify-content: space-between;
            margin-top: 5px;
        }
    }
}
</style>