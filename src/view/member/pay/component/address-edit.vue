<template>
  <!--    这是一个添加收货地址的组件-->
  <XtxDialog :title="title" v-if="valveCity" v-model:visible="valveCity">
    <!--      表单默认内容-->
    <div class="xtx-form">
      <div class="xtx-form-item">
        <div class="label">收货人：</div>
        <div class="field">
          <input v-model="fromData.receiver" class="input" placeholder="请输入收货人" />
        </div>
      </div>
      <div class="xtx-form-item">
        <div class="label">手机号：</div>
        <div class="field">
          <input v-model="fromData.contact"  class="input" placeholder="请输入手机号" />
        </div>
      </div>
      <div class="xtx-form-item">
        <div class="label">地区：</div>
        <div class="field">
          <XtxCity v-model="fromData.provinceCode" @change="changeCity"  placeholder="请选择收货地址" :fullLocation="fromData.fullLocation"/>
        </div>
      </div>
      <div class="xtx-form-item">
        <div class="label">详细地址：</div>
        <div class="field">
          <input v-model="fromData.address" class="input" placeholder="请输入详细的地址" />
        </div>
      </div>
      <div class="xtx-form-item">
        <div class="label">邮政编码：</div>
        <div class="field">
          <input v-model="fromData.postalCode" class="input" placeholder="请输入邮政编码" />
        </div>
      </div>
      <div class="xtx-form-item">
        <div class="label">地址标签：</div>
        <div class="field">
          <input v-model="fromData.addressTags" class="input" placeholder="请输入地址标签，逗号分隔" />
        </div>
      </div>
    </div>
    <!--      具名内容-->
    <template #footer>
      <XtxButton type="gray" style="margin-right:20px"  @click="valveCity=false">取消</XtxButton>
      <XtxButton type="primary" @click="addAddressFn" >确认</XtxButton>
    </template>

  </XtxDialog>
</template>

<script>
import {reactive, ref, watch} from "vue";
// 导入添加与修改地址的接口
import {addAddress,editAddress} from '@/api/order.js'

// 消息提示组件
import  Message  from '@/components/libray/Message.js'


export  default {
  props:{
    title:{
      type:String,
      default:"",
    }
  },
  setup(props,{emit}){
    let valveCity = ref(false)

    // 打开窗口
    let open = (data) => {
      valveCity.value = true
      // 这里需要判断是否是新建地址还是修改用户地址
      // 如果有id表示修改
      if (data.id){
        for (let key in data){
          fromData[key] = data[key]
        }
      } else {
        // 这里是添加数据的
        // 这里是清空原来输入的数据
        for (let key in fromData) {
          if (fromData[key] == 1) {
            fromData[key] = 1
          } else {
            fromData[key] = null
          }
        }
      }


    };

    // 双向数据绑定
    let fromData = reactive({
      receiver: null,
      contact: null,
      provinceCode: null,// 省编码
      cityCode: null,// 城市编码
      countyCode: null,// 县市区编码
      address: null,// 地址
      postalCode: null,
      addressTags: null,
      isDefault: 1,
      // 地区显示缩短语句
      fullLocation: null
    })



    // 这里是将当前选择的数据修改需要提交的数据中
    let changeCity = (result=>{
      fromData.provinceCode = result.provinceCode
      fromData.cityCode = result.cityCode
      fromData.countyCode = result.countyCode
      fromData.fullLocation = result.fullLocation
    })

    // 这里是提交
    let addAddressFn = () =>{
      // 修改地址
      if(fromData.id){
        editAddress(fromData).then(result=>{
          // 提示用户添加成功
          Message({type:"success",text:"成功修改"})
          // 将地址数据返回出去
          emit("changeAddAddress",fromData)
          // 关闭窗口
          valveCity.value = false
        })
      } else {
        // 添加地址
        addAddress(fromData).then(result=>{
          fromData.id = result.result.id
          // 提示用户添加成功
          Message({type:"success",text:"成功添加"})
          // 将地址数据返回出去
          emit("changeAddAddress",fromData)
          // 关闭窗口
          valveCity.value = false
        }).catch(({response:{data}})=>{
          Message({type:"success",text:`${data.message}`})
        })
      }

    }

    return {fromData,changeCity,addAddressFn,valveCity,open}
  }
}
</script>