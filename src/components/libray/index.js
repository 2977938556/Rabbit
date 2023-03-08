// 扩展vue原有的功能：全局组件，自定义指令，挂载原型方法，注意：没有全局过滤器。
// 这就是插件
// vue2.0插件写法要素：导出一个对象，有install函数，默认传入了Vue构造函数，Vue基础之上扩展
// vue3.0插件写法要素：导出一个对象，有install函数，默认传入了app应用实例，app基础之上扩展

// 加载分类效果
import XtxSkeleton from './xtx-skeleton.vue'
// 轮播图
import XtxCarousel from './xtx-carousel.vue'
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


export default {
    install(app) {
        // 在app上进行扩展，app提供 component directive 函数
        // 如果要挂载原型 app.config.globalProperties 方式
        app.component(XtxSkeleton.name, XtxSkeleton)
        app.component(XtxCarousel.name, XtxCarousel)
        app.component(XtxMore.name, XtxMore)
        app.component(XtxBread.name, XtxBread)
        app.component(XtxBreadItem.name, XtxBreadItem)
        app.component(XtxCheckBox.name, XtxCheckBox)
        app.component(XtxinfiniteLoding.name, XtxinfiniteLoding)
        // 注册图片懒加载效果
        defineDirective(app)
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