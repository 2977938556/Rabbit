<template>
    <div class="member-order">

        <!-- 这里是设置tab切换栏 -->
        <XtxTabs v-model="activeName" @update:modelValue="changeTab">
            <XtxTabsPanel v-for="item in orderStatus" :key="item.name" :name="item.name" :label="item.label"></XtxTabsPanel>
        </XtxTabs>

        <!-- lodin 加载状态 -->
        <div class="order-loding" v-if="loding">
            <OrderLoding />
        </div>


        <!-- 订单列表 -->
        <div class="order-list">
            <OrderItem @on-cancel-order="cancelOrder" @on-deldete-order="deleteOrderShanchu"
                @on-confirm-order="useConfirmOrder" @on-confirm-logistics="confirmLogistics" v-for="item in orderList"
                :order="item" :key="item.id" />
        </div>


        <!-- 没有数据的情况 -->
        <div class="order-err" v-if="orderList.length == 0">
            <h1>没有数据哦 </h1>
        </div>

        <!-- 这里是必须要条数大于0 才能显示分页器 -->
        <div class="order-pageno" v-if="finCount.total > 0">
            <!-- 分页器 -->
            <XtxPagination :pageNo="finCount.pageNo" :pageSize="finCount.pageSize" :total="finCount.total"
                @changePageData="changePageData" />
        </div>




        <!-- 使用一下取消组件 -->
        <OrderCancel ref="targetOrder"></OrderCancel>


        <!-- 使用一下查看物流组件 -->
        <OrderLogistics ref="targetConfirmLogincs" />




    </div>
</template>



<script>
import { nextTick, reactive, ref, watch } from 'vue'
// 导入单个订单组件
import OrderItem from './component/order-item.vue'

// 导入渲染tab列表
import { orderStatus } from '@/api/constants.js'

// 获取订单
import { findOrderList, delteOrder, confirmOrder } from '@/api/order.js'

// 导入提示组件
import Message from '@/components/libray/Message'

// 导入加载状态组件
import OrderLoding from './component/order-loding.vue'

// 导入取消订单组件
import OrderCancel from './component/order-cancel.vue'
// 导入确认收货组件
import XtxConfirm from '@/components/libray/XtxConfirm.js'
// 导入查看物流组件
import OrderLogistics from './component/order-logistics.vue'


export default {
    name: 'MemberOrder',
    components: { OrderItem, OrderLoding, OrderCancel, OrderLogistics },
    setup() {

        // 控制显示那个tab
        let activeName = ref("all")

        // 配置调用接口需要传递的参数
        let finCount = reactive({
            orderState: 0,// 需要获取订单的状态【服务器】
            page: 0,// 当前第几页【服务器】
            pageSize: 5,// 订单每一页显示多少条【服务器】

            total: 0,//总条数 【订单】
            pageNo: 1,// 当前是第几页【订单】
            continues: 5,// 显示多少个按钮 【订单】
        })

        // 这个是切换tab模块的
        let changeTab = ({ name, index }) => {
            // 先清空数据
            orderList.value = []
            // 这里是修改选中那哪个tab栏目
            activeName.value = name

            // 修改发送请求的数据
            finCount.page = 0 // 修改当前是第几页
            finCount.orderState = index //修改当前的数据状态
        }

        // // 分页器的
        let changePageData = (value) => {
            // 先清空数据
            orderList.value = []

            // 这里修改服务器需要的第几页数据
            finCount.page = value
            finCount.pageNo = value
        }

        // 这里是是获取订单数据
        let orderList = ref([])

        // 加载效果
        let loding = ref(false)

        // 根据订单获取数据
        let findOrder = () => {
            orderList.value = []
            loding.value = true
            findOrderList({ orderState: finCount.orderState, page: finCount.page, pageSize: finCount.pageSize }).then(({ result }) => {
                // 这里是填充总条数
                finCount.total = result.counts

                // 再加载数据
                orderList.value = result.items
                loding.value = false
            }).catch(e => {
                Message({ type: 'error', text: '获取订单失败，请重试' })
            })
        }

        // 监听函数
        watch(finCount, (newValue) => {
            findOrder()
        }, { immediate: true })


        return { activeName, changeTab, orderStatus, orderList, finCount, loding, changePageData, ...CrubOrder(), findOrder }
    }

}


// 将取消订单逻辑分离出去
let CrubOrder = () => {

    // 这个是获取取消订单的实例组件
    let targetOrder = ref(null)

    // 取消订单
    let cancelOrder = (order) => {
        // 使用获取到的组件实例打开对话框
        targetOrder.value.open(order)
    }


    // 这个是删除订单
    let deleteOrderShanchu = (order) => {
        //  全局确认框
        XtxConfirm({ title: "删除订单", text: "确定删除吗", }).then(() => {
            // 发送删除请求
            delteOrder(Number(order.id)).then((result) => {
                // 发送请求重新获取数据
                findOrder()
                // 给予提示
                return Message({ type: "success", text: "删除成功哦" })
            }).catch(() => {
                // 删除失败提示
                return Message({ type: "error", text: "删除失败哦" })
            })
        }).catch(() => { })
    }


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



    // 获取查看物流的实例组件
    let targetConfirmLogincs = ref(null)

    // 查看物流
    let confirmLogistics = (order) => {
        targetConfirmLogincs.value.open(order)
    }

    return { cancelOrder, targetOrder, deleteOrderShanchu, useConfirmOrder, confirmLogistics, targetConfirmLogincs }
}




</script>



<style scoped lang="less">
.order-list {
    background: #fff;
    padding: 20px;
}

.order-loding {
    min-height: 1000px;
    overflow: hidden;
}

.order-err {
    min-height: 500px;
    text-align: center;
    line-height: 200px;
}

.order-pageno {}
</style>