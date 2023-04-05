<template>
    <div class="detail-logistics">
        <p>
            <span>{{ logisticsList.list[0].time }}</span>
            <span>{{ logisticsList.list[0].text }}</span>
        </p>
        <a href="javascript:;" @click="confirmLogistics">查看物流</a>
    </div>
    <OrderLogistics ref="targetConfirmLogincs" />
</template>
<script>

// 导入查看物流组件
import OrderLogistics from './order-logistics.vue'


// 导入获取物流信息的api
import { logisticsOrder } from '@/api/order.js'
import { ref } from 'vue'
export default {
    name: 'DetailLogistics',
    components: { OrderLogistics },
    props: {
        order: {
            type: Object,
            default: () => ({})
        }
    },
    async setup(props) {

        let logisticsList = ref({})
        // 发送请求获取数据
        let { result } = await logisticsOrder(props.order.id)
        logisticsList.value = result





        // 这里是显示物流信息
        // 获取查看物流的实例组件
        let targetConfirmLogincs = ref(null)

        // 查看物流
        let confirmLogistics = () => {
            // 这里是开启物流信息对话框
            targetConfirmLogincs.value.open({ id: props.order.id })
        }

        return { logisticsList, targetConfirmLogincs, confirmLogistics }
    }
}
</script>
<style scoped lang="less">
.detail-logistics {
    height: 50px;
    display: flex;
    align-items: center;
    padding: 0 30px;
    background-color: #f5f5f5;
    margin: 30px 50px 0;

    >p {
        flex: 1;

        span {
            color: #999;

            &:first-child {
                margin-right: 30px;
            }
        }
    }

    >a {
        color: @xtxColor;
        text-align: center;
    }
}
</style>
  