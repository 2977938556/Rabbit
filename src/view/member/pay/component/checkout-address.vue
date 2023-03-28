<template>
  <div class="checkout-address">
    <div class="text">
      <div v-if="!showAddress" class="none">您需要先添加收货地址才可提交订单。</div>

      <ul v-if="showAddress">
        <li><span>收<i/>货<i/>人：{{showAddress.receiver}}</span></li>
        <li><span>联系方式：</span>{{showAddress.contact}}</li>
        <li><span>收货地址：{{showAddress.fullLocation+showAddress.address}}</span></li>
      </ul>
      <a v-if="showAddress" @click="visible=true" href="javascript:;">修改地址</a>
    </div>
    <div class="action">
      <XtxButton class="btn">切换地址</XtxButton>
      <XtxButton class="btn">添加地址</XtxButton>
    </div>
  </div>
  <template v-if="showAddress">
    <!--  这个是切换地址模块-->
    <XtxDialog title="切换收货地址" v-model:visible="visible" >
      <div class="text item" v-for="item in list" :key="item.id">
        <ul>
          <li><span>收<i/>货<i/>人：</span>{{item.receiver}}</li>
          <li><span>联系方式：</span>{{item.contact}}</li>
          <li><span>收货地址：</span>{{item.fullLocation+item.address}}</li>
        </ul>
      </div>
      <!--  设置具名插槽的内容-->
      <template #footer>
        <XtxButton @click="visible=false" type="gray" style="margin-right:20px">取消</XtxButton>
        <XtxButton @click="visible=false" type="primary">确认</XtxButton>
      </template>
    </XtxDialog>
  </template>

</template>
<script>
import {ref} from "vue"

export default {
  name: 'CheckoutAddress',
  props:{
    list:{
      type:[Array],
      default:()=>[]
    }
  },
  emits:["change"],
  setup(props,{emit}) {

    // 显示的地址
    const showAddress = ref(null)
    if (props.list.length) {
      const defaultAddress = props.list.find(item => item.isDefault === 1)
      if (defaultAddress) {
        showAddress.value = defaultAddress
      } else {
        showAddress.value = props.list[0]
      }
    }


    // 控制显示隐藏切换地址
    let visible = ref(false)


    // 初始化的时候需要默认提交一个默认的地址ID 通知给父级组件
    emit('change',showAddress.value)


    return {showAddress, visible}

  }
}
</script>
<style scoped lang="less">
.xtx-dialog {
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    &.item {
      border: 1px solid #f5f5f5;
      margin-bottom: 10px;
      cursor: pointer;
      &.active,&:hover {
        border-color: @xtxColor;
        background: lighten(@xtxColor,50%);
      }
      > ul {
        padding: 10px;
        font-size: 14px;
        line-height: 30px;
      }
    }
  }
}
.checkout-address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }
    > ul {
      flex: 1;
      padding: 20px;
      li {
        line-height: 30px;
        span {
          color: #999;
          margin-right: 5px;
          > i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }
    > a {
      color: @xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }
  .action {
    width: 420px;
    text-align: center;
    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;
      &:first-child {
        margin-right: 10px;
      }
    }
  }
}
</style>