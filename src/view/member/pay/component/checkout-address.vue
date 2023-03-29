<template>
  <div class="checkout-address">
    <div class="text">
      <div v-if="!showAddress" class="none">您需要先添加收货地址才可提交订单。</div>
      <ul v-if="showAddress">
        <li><span>收<i/>货<i/>人：{{showAddress.receiver}}</span></li>
        <li><span>联系方式：</span>{{showAddress.contact}}</li>
        <li><span>收货地址：{{showAddress.fullLocation+showAddress.address}}</span></li>
      </ul>
      <a v-if="showAddress" href="javascript:;" @click="openEdit(showAddress)">修改地址</a>
    </div>
    <div class="action">
      <XtxButton class="btn" @click="openDialog" >切换地址</XtxButton>
      <XtxButton class="btn" @click="openEdit({})">添加地址</XtxButton>
    </div>
  </div>
<!--     这个是切换地址组件-->
    <XtxDialog title="切换收货地址" v-model:visible="visible" >
    <div class="bxs" >
      <div :class="['text','item',{'active':selectAddressValue && selectAddressValue.id==item.id}]"  @click="selectAddressValue=item" v-for="item in list" :key="item.id">
        <ul>
          <li><span>收<i/>货<i/>人：</span>{{item.receiver}}</li>
          <li><span>联系方式：</span>{{item.contact}}</li>
          <li><span>收货地址：</span>{{item.fullLocation+item.address}}</li>
        </ul>
      </div>
    </div>
      <!--  设置具名插槽的内容-->
      <template #footer>
        <XtxButton @click="clone" type="gray" style="margin-right:20px" >取消</XtxButton>
        <XtxButton type="primary" @click="changeAddress">确认</XtxButton>
      </template>
    </XtxDialog>


<!--  添加地址组件-->
   <AddressEdit @changeAddAddress="AddAddress" ref="edit"  title="添加收货地址"></AddressEdit>



</template>
<script>
import {reactive, ref} from "vue"

// 添加地址组件
import AddressEdit  from "./address-edit.vue";


export default {
  name: 'CheckoutAddress',
  props:{
    list:{
      type:[Array],
      default:()=>[]
    }
  },
  emits:["change","update:visible","changeAddAddress"],
  components:{AddressEdit},
  setup(props, {emit}) {

    // 显示的地址
    const showAddress = ref(null)
    // 这里是判断是否有地址数据
    if (props.list.length) {
      // 如果有地址数据那么就查找到第一个地址数据
      const defaultAddress = props.list.find(item => item.isDefault === 1)
      if (defaultAddress) {
        // 如果有默认的地址数据那么就赋值给showAddress
        showAddress.value = defaultAddress
      } else {
        // 否则就返回默认的第一个默认地址
        showAddress.value = props.list[0]
      }
    }


    // 控制显示隐藏切换地址
    let visible = ref(false)
    // 打开切换地址
    let openDialog = () => {
      // 显示收货地址
      visible.value = true
      selectAddressValue.value = showAddress.value
    }
    // 初始化的时候需要默认提交一个默认的地址ID 通知给父级组件
    emit('change', showAddress.value)

    // 01：切换地址的点击确认按钮
    let changeAddress = () => {
      // 隐藏选择框
      visible.value = false
      // 将选中的值传递给判断条件
      showAddress.value = selectAddressValue.value
      // 发送自定义事件给父级
      emit('change', showAddress.value)
    }
    // 切换地址的点击取消按钮
    let clone = () => {
      visible.value = false
    }
    // 点击选中那个地址
    // 这个是用于判断是哪个被点击了
    let selectAddressValue = ref(showAddress.value)


    // 控制添加收获地址的显示隐藏
    let edit = ref(null)
    let openEdit = (data) => {
      edit.value.open(data)
    }

    // 这里是修改地址和添加地址的自定义事件
    let AddAddress = (fromData) => {
      // 这里如果遍历出
      let addrs =  props.list.find(item=>item.id==fromData.id)
      // 这里是有值的情况下
      if (addrs) {
        for(let key in addrs){
          addrs[key]=fromData[key]
        }
      } else {
        let atr = JSON.stringify(fromData)
        props.list.unshift(JSON.parse(atr))
      }
    }




    return {
      showAddress,
      visible,
      changeAddress,
      openDialog,
      selectAddressValue,
      clone,
      edit,
      openEdit,
      AddAddress
      // openAddress,
      // changeCity,
      // addAddressFn
    }
  }
}
</script>
<style scoped lang="less">
.bxs {
  height: 600px;
  overflow: auto;
}

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