<template>
    <div class="xtx-tabs-panel" v-show="name == activeName">
        <slot />
    </div>
</template>

<script>
import { inject } from 'vue'
export default {
    name: 'XtxTabsPanel',
    props: {
        // label 选项卡标题 // name 选项卡标识  this.$stol.default() 拿到选项卡内容
        label: {
            type: String,
            default: ""
        },
        name: {
            type: [String, Boolean, Number],
            default: ''
        }
    },
    setup() {
        // 当前组件该不该显示，取决于xtx-tabs组件的activeName数据是否和props.name一样
        const activeName = inject('activeName')

        return { activeName }
    }
}


</script>


