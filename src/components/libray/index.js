// 扩展vue原有的功能：全局组件，自定义指令，挂载原型方法，注意：没有全局过滤器。
// 这就是插件
// vue2.0插件写法要素：导出一个对象，有install函数，默认传入了Vue构造函数，Vue基础之上扩展
// vue3.0插件写法要素：导出一个对象，有install函数，默认传入了app应用实例，app基础之上扩展

// 加载分类效果
import XtxSkeleton from './xtx-skeleton.vue'
// 轮播图
import XtxCarousel from './xtx-carousel.vue'
// 产品组件
import GoodsItem from './xtx-goodsitem.vue'
// 更多 按钮
import XtxMore from './xtx-more.vue'
// 面包屑
import XtxBread from './xtx-bread.vue'
// 单项面包屑组件
import XtxBreadItem from './xtx-bread-item.vue'
// 复选框
import XtxCheckBox from './xtx-checkbox.vue'
// 无限加载组件
import XtxinfiniteLoding from './xtx-infinite-loding.vue'
// 地区组件
import XtxCity from './xtx-city.vue'
// 数量增加减小
import XtxNumbox from './xtx-numbox.vue'
// 按钮
import XtxButton from './xtx-button.vue'
// 分页器
import XtxPagination from './xtx-pagination.vue'
// 全局提示组件
import XtxMessage from './xtx-message.vue'
// 全局提示框
import Message from './Message.js'

// 全局提示框
import Confirm from './XtxConfirm.js'
// 全局交互提示框
import XtxDialog from './xtx-dialog.vue'


// tab组件
import XtxTabs from './xtx-tabs.vue'
// tab组合组件
import XtxTabsPanel from './xtx-tabs-panel.vue'


// 步骤条
import XtxSteps from './xtx-steps.vue'
// 步骤条单个itme组件
import XtxStepsItem from './xtx-steps-item.vue'

export default {
    install(app) {
        // 在app上进行扩展，app提供 component directive 函数
        // 如果要挂载原型 app.config.globalProperties 方式
        app.component(XtxSkeleton.name, XtxSkeleton)
        app.component(XtxCarousel.name, XtxCarousel)
        app.component(XtxMore.name, XtxMore)
        app.component(GoodsItem.name, GoodsItem)
        app.component(XtxBread.name, XtxBread)
        app.component(XtxBreadItem.name, XtxBreadItem)
        app.component(XtxCheckBox.name, XtxCheckBox)
        app.component(XtxinfiniteLoding.name, XtxinfiniteLoding)
        app.component(XtxCity.name, XtxCity)
        app.component(XtxNumbox.name, XtxNumbox)
        app.component(XtxButton.name, XtxButton)
        app.component(XtxPagination.name, XtxPagination)
        app.component(XtxMessage.name, XtxMessage)
        app.component(XtxDialog.name, XtxDialog)
        app.component(XtxTabs.name, XtxTabs)
        app.component(XtxTabsPanel.name, XtxTabsPanel)
        app.component(XtxSteps.name, XtxSteps)
        app.component(XtxStepsItem.name, XtxStepsItem)
        // 注册图片懒加载效果
        defineDirective(app)
        // 注册全局提示框
        app.config.globalProperties.$message = Message //原型函数
        app.config.globalProperties.$confirm = Confirm //原型函数

    }
}


// 指令
const defineDirective = (app) => {
    // 图片懒加载指令
    app.directive('lazy', {
        mounted(el, binding) {
            const observer = new IntersectionObserver(([{ isIntersecting }]) => {
                if (isIntersecting) {
                    observer.unobserve(el)
                    el.src = binding.value
                }
            }, {
                threshold: 0.01
            })
            observer.observe(el)
        }
    })
}