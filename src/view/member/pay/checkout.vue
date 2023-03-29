<template>
  <div class="xtx-pay-checkout-page">
    <div class="container">
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem to="/cart">购物车</XtxBreadItem>
        <XtxBreadItem>填写订单</XtxBreadItem>
      </XtxBread>
      <div class="wrapper" v-if="checkoutInfo.userAddresses">
        <!-- 收货地址 -->
        <h3 class="box-title">收货地址</h3>
        <div class="box-body">
          <div class="address" >
        <!--  收获地址-->
            <CheckoutAddress :list="checkoutInfo.userAddresses"  @change="changeAddress" />
<!--            @changeAddAddress="AddAddress"-->
          </div>
        </div>
        <!-- 商品信息 -->
        <h3 class="box-title">商品信息</h3>
        <div class="box-body">
          <table class="goods">
            <thead>
            <tr>
              <th width="520">商品信息</th>
              <th width="170">单价</th>
              <th width="170">数量</th>
              <th width="170">小计</th>
              <th width="170">实付</th>
            </tr>
            </thead>
            <tbody>
<!--            商品信息列表-->
            <template v-if="checkoutInfo">
              <tr v-for="item in checkoutInfo.goods" :key="item.id">
                <td>
                  <a class="info" href="javascript:;">
                    <img alt="" :src="item.picture">
                    <div class="right">
                      <p>{{item.name}}</p>
                      <p>{{item.attrsText}}</p>
                    </div>
                  </a>
                </td>
                <td>&yen;{{item.price}}</td>
                <td>{{item.count}}</td>
                <td>&yen;{{item.totalPayPrice}}</td>
                <td>&yen;{{item.totalPrice}}</td>
              </tr>
            </template>
            </tbody>
          </table>
        </div>
        <!-- 配送时间 -->
        <h3 class="box-title">配送时间</h3>
        <div class="box-body">
          <a class="my-btn active" href="javascript:;">不限送货时间：周一至周日</a>
          <a class="my-btn" href="javascript:;">工作日送货：周一至周五</a>
          <a class="my-btn" href="javascript:;">双休日、假日送货：周六至周日</a>
        </div>
        <!-- 支付方式 -->
        <h3 class="box-title">支付方式</h3>
        <div class="box-body">
          <a class="my-btn active" href="javascript:;">在线支付</a>
          <a class="my-btn" href="javascript:;">货到付款</a>
          <span style="color:#999">货到付款需付5元手续费</span>
        </div>
        <!-- 金额明细 -->
        <h3 class="box-title">金额明细</h3>
        <div class="box-body">
          <div class="total">
            <dl>
              <dt>商品件数：</dt>
              <dd>5件</dd>
            </dl>
            <dl>
              <dt>商品总价：</dt>
              <dd>¥5697.00</dd>
            </dl>
            <dl>
              <dt>运<i></i>费：</dt>
              <dd>¥0.00</dd>
            </dl>
            <dl>
              <dt>应付总额：</dt>
              <dd class="price">¥5697.00</dd>
            </dl>
          </div>
        </div>
        <!-- 提交订单 -->
        <div class="submit">
          <XtxButton type="primary" @click="subOrder">提交订单</XtxButton>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// 选择收货地址模块
import CheckoutAddress from "./component/checkout-address.vue"
import Message from '@/components/libray/Message.js'
// 导入结算信息的api
import {findCheckoutInfo,createOrder} from '@/api/order.js'
import {reactive, ref} from "vue"
import Login from "../../login/index.vue";
import {useRouter} from "vue-router";

export default {
  name: 'Checkout',
  components:{CheckoutAddress},
  setup() {
    let router = useRouter()
    // 收集获取的商品数据
    let checkoutInfo = ref({})
    findCheckoutInfo().then(({result}) => {
      checkoutInfo.value = result
      requestParams.goods = result.goods.map(({skuId,count})=>({skuId,count}))
    })


    // 需要提交的订单字段
    const requestParams = reactive({
          addressId: null,
          deliveryTimeType: 1,
          payType: 1,
          buyerMessage: '',
          goods: []
    })

    // 选择地址的组件
    const changeAddress = (value) => {
      // 选择组件的时候将地址id传递回去
      requestParams.addressId = value.id
    }





    // 提交
    let subOrder = () =>{
      // 判读是否有有地址id
      if (!requestParams.addressId){
          return Message({type:"success",text:"请选择地址",})
      } else {
        // 有数据那么就提交订单并且跳转到支付页面
        createOrder(requestParams).then(result=>{
          // 跳转到订单页面
          router.push(`/member/pay?id=${result.result.id}`);
        })
      }
    }

    return {checkoutInfo,changeAddress,requestParams,subOrder}
  }





}
</script>
<style lang="less" scoped>
.xtx-pay-checkout-page {
  .wrapper {
    background: #fff;
    padding: 0 20px;

    .box-title {
      font-size: 16px;
      font-weight: normal;
      padding-left: 10px;
      line-height: 70px;
      border-bottom: 1px solid #f5f5f5;
    }

    .box-body {
      padding: 20px 0;
    }
  }
}


.goods {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;

  .info {
    display: flex;
    text-align: left;

    img {
      width: 70px;
      height: 70px;
      margin-right: 20px;
    }

    .right {
      line-height: 24px;

      p {
        &:last-child {
          color: #999;
        }
      }
    }
  }

  tr {
    th {
      background: #f5f5f5;
      font-weight: normal;
    }

    td, th {
      text-align: center;
      padding: 20px;
      border-bottom: 1px solid #f5f5f5;

      &:first-child {
        border-left: 1px solid #f5f5f5;
      }

      &:last-child {
        border-right: 1px solid #f5f5f5;
      }
    }
  }
}

.my-btn {
  width: 228px;
  height: 50px;
  border: 1px solid #e4e4e4;
  text-align: center;
  line-height: 48px;
  margin-right: 25px;
  color: #666666;
  display: inline-block;

  &.active, &:hover {
    border-color: @xtxColor;
  }
}

.total {
  dl {
    display: flex;
    justify-content: flex-end;
    line-height: 50px;

    dt {
      i {
        display: inline-block;
        width: 2em;
      }
    }

    dd {
      width: 240px;
      text-align: right;
      padding-right: 70px;

      &.price {
        font-size: 20px;
        color: @priceColor;
      }
    }
  }
}

.submit {
  text-align: right;
  padding: 60px;
  border-top: 1px solid #f5f5f5;
}
</style>