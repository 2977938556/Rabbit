<template>
    <div class="detail-action">
        <div class="state">
            <span class="iconfont icon-order-unpay"></span>
            <p>待支付</p>
        </div>
        <div class="info">
            <p>订单编号:{{ order.id }}</p>
            <p>下单时间：{{ order.createTime }}</p>
        </div>
        <div class="btn">

            <!--  待付款 -->
            <div v-if="order.orderState == 1">
                <XtxButton type="primary" size="small" @click="$router.push(`/member/pay/?id=${order.id}`)">立即付款</XtxButton>
                <XtxButton type="gray" size="small" @click="cancelOrder(order)">取消订单</XtxButton>
            </div>

            <!-- 待发货 -->
            <div v-if="order.orderState == 2">
                <XtxButton type="plain" size="small" @click="$router.push(`/member/checkout?orderId=${order.id}`)">再次购买
                </XtxButton>
            </div>

            <!-- 待收货货 -->
            <div v-if="order.orderState == 3">
                <XtxButton type="primary" size="small" @click="useConfirmOrder(order)">确认收货</XtxButton>
                <XtxButton type="plain" size="small" @click="$router.push(`/member/checkout?orderId=${order.id}`)">再次购买
                </XtxButton>
                <XtxButton type="gray" size="small">申请售后</XtxButton>
            </div>

            <!-- 待评价 -->
            <div v-if="order.orderState == 4">
                <XtxButton type="primary" size="small">评价商品</XtxButton>
                <XtxButton type="plain" size="small" @click="$router.push(`/member/checkout?orderId=${order.id}`)">再次购买
                </XtxButton>
                <XtxButton type="gray" size="small">申请售后</XtxButton>
            </div>

            <!-- 已完成 -->
            <div v-if="order.orderState == 5">
                <XtxButton type="plain" size="small" @click="$router.push(`/member/checkout?orderId=${order.id}`)">再次购买
                </XtxButton>
            </div>

            <!-- 已完成 -->
            <div v-if="order.orderState == 6">
                <XtxButton type="plain" size="small">已经取消订单</XtxButton>
            </div>


            <!-- 使用一下查看物流组件 -->
            <OrderCancel ref="targetOrder" />


        </div>
    </div>
</template>
<script>


import { ref } from 'vue'

// 导入取消订单组件
import OrderCancel from './order-cancel.vue'
// 导入确认收货组件
import XtxConfirm from '@/components/libray/XtxConfirm.js'
// 导入确认收货订单的Api
import { confirmOrder } from '@/api/order.js'
// 导入提示框组件
import Message from '@/components/libray/Message.js'


export default {
    name: 'OrderDetailAction',
    components: { OrderCancel },
    props: {
        order: {
            type: [Object, Array],
            default: () => ({})
        }
    },
    setup() {

        // 这个是获取取消订单的实例组件
        let targetOrder = ref(null)

        // 取消订单
        let cancelOrder = (order) => {
            // 使用获取到的组件实例打开对话框
            targetOrder.value.open(order)
        }



        // 确认收货按钮

        // 确认收货
        let useConfirmOrder = (order) => {
            XtxConfirm({ title: "确认收货", text: "您确认收货吗" }).then(() => {
                confirmOrder(order.id).then(() => {
                    // 需要修改状态
                    order.orderState = 5
                    // 删除失败提示
                    return Message({ type: "success", text: "确认收货成功" })
                }).catch(() => {
                    // 删除失败提示
                    return Message({ type: "error", text: "确认收货成功" })
                })
            }).catch(() => { })
        }















        return { targetOrder, cancelOrder, useConfirmOrder }

    }
}
</script>
<style scoped lang="less">
.detail-action {
    height: 180px;
    width: 100%;
    display: flex;
    align-items: center;

    .state {
        width: 220px;
        text-align: center;

        .iconfont {
            font-size: 40px;
            color: @xtxColor;
        }

        p {
            font-size: 16px;
            color: #666;
            margin-bottom: 10px;
        }
    }

    .info {
        width: 240px;
        line-height: 30px;

        p {
            color: #999;
        }
    }

    .btn {
        flex: 1;
        text-align: right;
        margin-right: 100px;

        .xtx-button {
            margin-left: 20px;
        }
    }
}</style>