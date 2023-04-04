<script lang="jsx">
import { provide, watch, ref } from 'vue'
export default {
   name: "XtxTabs",
   props: ['modelValue'],
   emits: ['update:modelValue', "tab-click"],
   setup(props, { emit }) {





      // 首先需要一个变量接收数据
      let tab = ref('')

      tab.value = props.modelValue

      let onClickTab = (name, index) => {
         // 赋值给接收变量
         tab.value = name
         // 调用自定义方法修改父组件的数据
         emit('update:modelValue', { name, index })
      }

      // 启用监听事件
      watch(() => props.modelValue, (newvalue => {
         // 这里一监听到父组件的数据就将数据赋值给tab变量
         tab.value = props.modelValue
      }), { immediate: true })



      provide("activeName", tab)




      return { onClickTab, tab }
   },

   render() {

      // 获取插槽内容
      let items = this.$slots.default()


      let dynameicPanels = []
      items.forEach((item, i) => {
         // 这里由于有的时候会使用v-for 进行渲染组件
         // 所以说这里需要判断一下
         // 这里是普通的
         if (item.type.name === 'XtxTabsPanel') {
            dynameicPanels.push(item)
            // 这里是判断是否是使用v-for进行遍历的
         } else if (item.children.length != 0) {
            item.children.forEach(items => {
               dynameicPanels.push(items)
            })

         }

      })



      // 01 最大的容器
      // 02 选项卡
      // 03 内容
      // 在nav标签中渲染改组件传递来的默认插槽内容


      // 渲染头部组件、
      let nav = <nav>
         {dynameicPanels.map((item, i) => {
            return <a class={{ active: item.props.name == this.tab }} onClick={() => this.onClickTab(item.props.name, i)} href="javascript:;">{item.props.label}</a>
         })}
      </nav>








      // 内容租价由于xtx-tabs-panel 组件中已经接收了所以直接传递默认的slot插槽
      return <div class="xtx-tabs">{[nav, items]}</div>
   }
}

</script>
<style scoped lang="less">
.xtx-tabs {
   background: rgb(255, 255, 255);

   >nav {
      height: 60px;
      line-height: 60px;
      display: flex;
      border-bottom: 1px solid #e96262;

      >a {
         width: 110px;
         border-right: 1px solid #f5f5f5;
         text-align: center;
         font-size: 16px;

         &.active {
            border-top: 2px solid @xtxColor;
            height: 60px;
            background: #fff;
            line-height: 56px;
         }
      }
   }
}
</style>