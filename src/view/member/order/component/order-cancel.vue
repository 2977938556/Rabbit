<template>
    <XtxDialog title="取消订单" v-model:visible="visibleDialog">
        <!-- 组件内容 -->
        <div class="cancel-info">
            <p>取消订单后，本单享有的优惠可能会一并取消，是否继续？</p>
            <p class="tip">请选择取消订单的原因（必选）：</p>
            <div class="btn">
                <a @click="currentText = item" v-for="item in cancelReason" :key="item" href="javascript:;"
                    :class="{ active: currentText === item }">
                    {{ item }}
                </a>
            </div>
        </div>

        <template #footer>
            <XtxButton type="gray" @click="visibleDialog = false" style="margin-right:20px">取消</XtxButton>
            <XtxButton type="primary" @click="submit">确认</XtxButton>
        </template>
    </XtxDialog>
</template>

<script>
import { ref } from 'vue'
// 这个是取消理由元数据
import { cancelReason } from '@/api/constants.js'
// 提示组件
import Message from '@/components/libray/Message'
// 取消接口
import { cancelOrder } from '@/api/order.js'

export default {
    name: "OrderCancel",
    setup() {
        // 控制是否显示
        let visibleDialog = ref(false)

        // 控制被选中的取消理由
        let currentText = ref('')


        // 这个获取需要被取消的订单数据
        let order = ref(null)

        let open = (orders) => {
            // 开启对话框
            visibleDialog.value = true
            order.value = orders
        }



        // 提交
        let submit = () => {
            // 判断是选中了取消条件
            if (!currentText.value) {
                return Message({ type: "error", text: "请选中取消理由" })
            }

            // 发送请求传递 订单id 和取消理由
            cancelOrder({ orderId: order.value.id, cancelReason: currentText.value }).then(result => {
                return Message({ typr: 'success', text: '取消订单成功' })
            })

            // 将状态修改为取消的状态
            order.value.orderState = 6


            // 关闭当前的窗口
            visibleDialog.value = false
        }


        return { visibleDialog, cancelReason, currentText, open, submit }
    }

}
</script>


<style scoped lang="less">
.xtx-dialog :v-deep(.wrapper) {
    width: 620px;
}

.cancel-info {

    p {
        font-size: 16px;
        line-height: 35px;

        &.tip {
            color: #999;
        }
    }

    .btn {
        padding-top: 21px;
        display: flex;
        flex-wrap: wrap-reverse;
        align-items: center;


        a {
            width: 256px;
            height: 45px;
            line-height: 45px;
            text-align: center;
            background-color: #ffffff;
            border: 1px solid #e4e4e4;
            margin-right: 20px;
            margin-bottom: 20px;
            color: #666;

            &:nth-child(2n) {
                margin-right: 0;
            }

            &:hover,
            &.active {
                background-color: #e3f9f4;
                border-color: @xtxColor;
            }
        }
    }
}
</style>