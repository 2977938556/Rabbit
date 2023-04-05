<template>
    <div class="order-detail-page" v-if="orderDetial">
        <!-- 操作栏 -->
        <!-- 这个是需要被渲染出来的 -->
        <OrderDetailAction :order="orderDetial"></OrderDetailAction>

        <!-- 步骤条 组件xtx-steps.vue-->
        <XtxSteps :active="orderDetial.orderState == 6 ? 1 : orderDetial.orderState">
            <XtxStepsItem title=" 提交订单" :desc="orderDetial.createTime" />
            <XtxStepsItem title="付款成功" :desc="orderDetial.payTime" />
            <XtxStepsItem title="商品发货" :desc="orderDetial.consignTime" />
            <XtxStepsItem title="确认收货" :desc="orderDetial.evaluationTime" />
            <XtxStepsItem title="订单完成" :desc="orderDetial.endTime" />
        </XtxSteps>

        <!-- 物流栏 -->
        <Suspense>
            <template #default>
                <DetailLogistics v-if="[3, 4, 5].includes(orderDetial.orderState)" :order="orderDetial"></DetailLogistics>
            </template>
            <template #fallback>
                <div class="loding-logistaics">
                    <p>正在加载中...</p>
                </div>
            </template>
        </Suspense>

        <!-- 订单商品信息 -->
        <DetailInfor :order="orderDetial"></DetailInfor>
    </div>
</template>
<script>

// 导入订单详情组件
import OrderDetailAction from './component/detail-action.vue'
// 导入物流信息
import DetailLogistics from './component/detail-logistics.vue'
// 导入订单详情
import DetailInfor from './component/detail-info.vue'

import { findOrder } from '@/api/order.js';
import { useRoute } from 'vue-router';
import { ref } from 'vue'

export default {
    name: 'OrderDetailPage',
    components: { OrderDetailAction, DetailLogistics, DetailInfor },

    setup() {
        // 获取路由上的id 获取订单数据
        let route = useRoute()
        // 接收数据
        let orderDetial = ref(null)

        // 根据id发送请求获取数据
        findOrder(route.params.id).then(({ result }) => {
            orderDetial.value = result
        })

        return { orderDetial }
    }



}
</script>
<style scoped lang="less">
.order-detail-page {
    background: #fff;
    min-height: 1081px;
}

.loding-logistaics {
    height: 50px;
    align-items: center;
    background-color: #f5f5f5;
    text-align: center;
    line-height: 50px;
}
</style>