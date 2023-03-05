<script>
import { h } from 'vue';
export default {
    name: 'XtxBread',
    render() {
        let items = this.$slots.default();
        let dymanitems = [];
        items.forEach((item, index) => {
            //  每次循环遍历的时候push 一个组件进去
            dymanitems.push(item);
            // 这里是判断是否是最后一个元素如果是那么就不会push元素进去
            if (index < items.length - 1) {
                dymanitems.push(h('i', { class: 'iconfont icon-angle-right' }))
            }
        })
        //  渲染最大的容器，并在里面讲slot中的数据添加进去
        return h('div', { class: 'xtx-bread' }, dymanitems)
    }
}
</script>
  
<style  lang='less'>
.xtx-bread {
    display: flex;
    padding: 25px 10px;

    &-item {
        a {
            color: #666;
            transition: all .4s;

            &:hover {
                color: @xtxColor;
            }
        }
    }

    i {
        font-size: 12px;
        margin-left: 5px;
        margin-right: 5px;
        line-height: 22px;
    }
}
</style>