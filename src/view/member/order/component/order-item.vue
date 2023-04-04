<template>
    <div class="order-order">
        <div class="head">
            <span>下单时间：{{ order.createTime }}</span>
            <span>订单编号：{{ order.id }}</span>
            <span class="down-time" v-if="order.orderState == 1">
                <i class="iconfont icon-down-time"></i>
                <b>付款截止：{{ trimText }}</b>
            </span>
            <a href="javascript:;" @click="$emit('on-deldete-order', order)" class="del"
                v-if="[3, 4, 5, 6].includes(order.orderState)">删除订单</a>
        </div>

        <!-- 产品内容 -->
        <div class="body">
            <div class="column goods">
                <ul>
                    <li v-for="orders in order.skus" :key="orders.spuId">
                        <RouterLink :to="`/product/${orders.id}`" class="image" href="javascript:;">
                            <img :src="orders.image" alt="" />
                        </RouterLink>
                        <div class="info">
                            <p class="name ellipsis-2">{{ orders.name }}</p>
                            <p class="attr ellipsis">
                                <span>{{ orders.attrsText }}</span>
                            </p>
                        </div>
                        <div class="price">¥{{ orders.realPay }}</div>
                        <!-- 下午完成tab渲染 -->
                        <div class="count">x{{ orders.quantity }}</div>
                    </li>
                </ul>
            </div>
            <div class="column state">
                <p>{{ orderStatus[order.orderState].label }}</p>
                <p v-if="order.orderState == 3"><a href="javascript:;" class="green">查看物流</a></p>
                <p v-if="order.orderState == 4"><a href="javascript:;" class="green">评价商品</a></p>
                <p v-if="order.orderState == 5"><a href="javascript:;" class="green">查看评价</a></p>
            </div>
            <div class="column amount">
                <p class="red">¥{{ order.totalMoney }}</p>
                <p>（含运费：¥{{ order.postFee }}）</p>
                <p>在线支付</p>
            </div>
            <div class="column action">
                <!-- 待支付：立即付款，查看详情，取消订单 -->
                <!-- 待发货：查看详情，再次购买 -->
                <!-- 待收货：确认收货，查看详情，再次购买 -->
                <!-- 待评价：查看详情，再次购买，申请售后 -->
                <!-- 已完成：查看详情，再次购买，申请售后 -->
                <!-- 已取消：查看详情 -->
                <!-- 这里是判断数据 -->
                <XtxButton @click="$router.push(`/member/pay?id=${order.id}`)" v-if="order.orderState == 1" type="primary"
                    size="small">立即付款</XtxButton>
                <XtxButton @click="$emit('on-confirm-order',order)" v-if="order.orderState == 3" type="primary"
                    size="small">确认收货</XtxButton>
                <p v-if="[1, 2, 3, 4, 5, 6].includes(order.orderState)"><a href="javascript:;">查看详情</a></p>
                <p v-if="[1].includes(order.orderState)" @click="$emit('on-cancel-order', order)"><a
                        href="javascript:;">取消订单</a></p>
                <p v-if="[2, 3, 4, 5].includes(order.orderState)"><a href="javascript:;">再次购买</a></p>
                <p v-if="[3, 4].includes(order.orderState)"><a href="javascript:;">申请售后</a></p>
            </div>
        </div>
    </div>
</template>


<script>


// 导入渲染tab列表
import { orderStatus } from '@/api/constants.js'
import { orderCountDown } from '@/hooks/index.js';


export default {
    name: "Orderorder",
    emits: ["on-cancel-order", "on-deldete-order","on-confirm-order"],
    props: {
        order: {
            type: [Object, Array],
            default: () => { }
        }
    },

    setup(props) {
        // 这里需要开启定时器
        let { start, trimText } = orderCountDown()
        start(props.order.countdown)
        return { orderStatus, trimText }
    }



}


</script>




<style scoped lang="less">
.order-order {
    margin-bottom: 20px;
    border: 1px solid #f5f5f5;

    .head {
        height: 50px;
        line-height: 50px;
        background: #f5f5f5;
        padding: 0 20px;
        overflow: hidden;

        span {
            margin-right: 20px;

            &.down-time {
                margin-right: 0;
                float: right;

                i {
                    vertical-align: middle;
                    margin-right: 3px;
                }

                b {
                    vertical-align: middle;
                    font-weight: normal;
                }
            }
        }

        .del {
            margin-right: 0;
            float: right;
            color: #999;
        }
    }

    .body {
        display: flex;
        align-orders: stretch;

        .column {
            border-left: 1px solid #f5f5f5;
            text-align: center;
            padding: 20px;

            >p {
                padding-top: 10px;
            }

            &:first-child {
                border-left: none;
            }

            &.goods {
                flex: 1;
                padding: 0;
                align-self: center;

                ul {
                    li {
                        border-bottom: 1px solid #f5f5f5;
                        padding: 10px;
                        display: flex;

                        &:last-child {
                            border-bottom: none;
                        }

                        .image {
                            width: 70px;
                            height: 70px;
                            border: 1px solid #f5f5f5;
                        }

                        .info {
                            width: 220px;
                            text-align: left;
                            padding: 0 10px;

                            p {
                                margin-bottom: 5px;

                                &.name {
                                    height: 38px;
                                }

                                &.attr {
                                    color: #999;
                                    font-size: 12px;

                                    span {
                                        margin-right: 5px;
                                    }
                                }
                            }
                        }

                        .price {
                            width: 100px;
                        }

                        .count {
                            width: 80px;
                        }
                    }
                }
            }

            &.state {
                width: 120px;

                .green {
                    color: @xtxColor;
                }
            }

            &.amount {
                width: 200px;

                .red {
                    color: @priceColor;
                }
            }

            &.action {
                width: 140px;

                a {
                    display: block;

                    &:hover {
                        color: @xtxColor;
                    }
                }
            }
        }
    }
}
</style>