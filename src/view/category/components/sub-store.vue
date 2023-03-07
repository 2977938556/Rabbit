<template>
    <div class='sub-sort'>
        <div class="sort">
            <a :class="{ active: sortParams.sortField == null }" @click="changeStore(null)" href="javascript:;">默认排序</a>
            <a :class="{ active: sortParams.sortField == `publishTime` }" @click="changeStore('publishTime')"
                href="javascript:;">最新商品</a>
            <a :class="{ active: sortParams.sortField == `orderNum` }" @click="changeStore('orderNum')"
                href="javascript:;">最高人气</a>
            <a :class="{ active: sortParams.sortField == `evaluateNum` }" @click="changeStore('evaluateNum')"
                href="javascript:;">评论最多</a>
            <a href="javascript:;" @click="changeStore('price')">
                价格排序
                <i class="arrow up"
                    :class="{ active: sortParams.sortField == `price` && sortParams.sortMethod == `asc` }" />
                <i class="arrow down"
                    :class="{ active: sortParams.sortField == `price` && sortParams.sortMethod == `desc` }" />
            </a>
        </div>
        <div class="check">
            <XtxCheckBox v-model="sortParams.inventory">仅显示有货商品</XtxCheckBox>
            <XtxCheckBox v-model="sortParams.onlyDiscount">仅显示特惠商品</XtxCheckBox>
        </div>


    </div>
</template>
<script>
import { reactive } from 'vue'
export default {
    name: 'SubSort',
    // 1. 根据后台需要的参数定义数据对象
    // 2. 根据数据对象，绑定组件（复选框，排序按钮）
    // 3. 在操作排序组件的时候，需要反馈给数据对象
    // sortField====>publishTime,orderNum,price,evaluateNum
    // sortMethod====>asc为正序 desc为倒序
    setup() {
        // 整合数据
        let sortParams = reactive({
            inventory: false,// 只显示有货
            onlyDiscount: false,// 只显示特惠商品
            sortField: null,// 四个筛选条件
            sortMethod: null// 价格的升序与降序
        })

        let changeStore = (val) => {
            // 先判断是否是价格升序降序
            if (val == 'price') {
                sortParams.sortField = 'price'
                // 这里是判断是否是第一次点击来的
                if (sortParams.sortMethod == null) {
                    // 第一次默认修改为降序
                    sortParams.sortMethod = 'desc'
                } else {
                    sortParams.sortMethod = sortParams.sortMethod == 'desc' ? 'asc' : 'desc'
                }


                // 除了价格升序降序的条件
            } else {
                // 如果判断点击的还在点击当前的位置那么就取消
                if (sortParams.sortField == val) return
                // 修改按钮数据
                sortParams.sortField = val;
                // 清空价格数据
                sortParams.sortMethod = null;
            }






            // 02:点击将值修改为他 如果是当前的值那么就不执行




        }






        return { sortParams, changeStore }
    }
}
</script>



<style lang="less" scoped>
.sub-sort {
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .sort {
        display: flex;

        a {
            height: 30px;
            line-height: 28px;
            border: 1px solid #e4e4e4;
            padding: 0 20px;
            margin-right: 20px;
            color: #999;
            border-radius: 2px;
            position: relative;
            transition: all .3s;

            &.active {
                background: @xtxColor;
                border-color: @xtxColor;
                color: #fff;
            }

            .arrow {
                position: absolute;
                border: 5px solid transparent;
                right: 8px;

                &.up {
                    top: 3px;
                    border-bottom-color: #bbb;

                    &.active {
                        border-bottom-color: @xtxColor;
                    }
                }

                &.down {
                    top: 15px;
                    border-top-color: #bbb;

                    &.active {
                        border-top-color: @xtxColor;
                    }
                }
            }
        }
    }

    .check {
        .xtx-checkbox {
            margin-left: 20px;
            color: #999;
        }
    }
}
</style>