//  导入解析组件虚拟dom元素 还有渲染函数
import { createVNode, render } from 'vue'
// 导入消息提示组件
import XtxMessage from './xtx-message.vue'


// 准备一个容器存放
let div = document.createElement('div')
div.setAttribute('class', 'xtx-message-content')
document.body.appendChild(div)



let time = null


export default ({ type, text }) => {
    // 实现：根据xtx-message.vue渲染消息提示
    // 1. 导入组件
    // 2. 根据组件创建虚拟节点
    let vndom = createVNode(XtxMessage, { type, text })
    // 3. 准备一个DOM容器
    // 4. 把虚拟节点渲染DOM容器中
    render(vndom, div)
    // 5. 开启定时，移出DOM容器内容
    clearTimeout(time)
    time = setTimeout(() => {
        // 3s 后重新清空dom元素
        render(null, div)
    }, 3000)
}



