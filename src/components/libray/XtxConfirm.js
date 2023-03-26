// 1 导入组件
// 2 转换成虚拟节点
// 3 准备容器、
// 4 渲染数据

import { createVNode, render } from 'vue'
import XtxXonfirm from './xtx-confirm.vue'

// 准备容器
let div = document.createElement('div')
// 添加类名
div.setAttribute('class', 'xtx-confirm-container')
// 渲染到body中
document.body.appendChild(div)


// 这里是传递的值
export default ({ title, text }) => {
    return new Promise((resolve, reject) => {
        // 由于需要进行交互所以可以传递一个函数
        let subCallback = () => {
            render(null, div)
            resolve()
        }
        let closeCallback = () => {
            render(null, div)
            reject(new Error('点击取消'))
        }
        // 生成虚拟节点
        let ven = createVNode(XtxXonfirm, { title, text, subCallback, closeCallback })
        // 渲染再容器内部
        render(ven, div)
    })

}