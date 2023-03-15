<template>
    <div class="xtx-pagination">

        <a href="javascript:;" class="disabled">上一页</a>
        <a href="javascript:;" v-if="pageData.start > 1">1</a>
        <span v-if="pageData.start > 2">...</span>
        <template v-for="item in pageData.end" :key="item">
            <a href="javascript:;" :class="{ active: Select == item }" v-if="item >= pageData.start">{{ item }}</a>
        </template>
        <span v-if="pageData.end < pageData.pageCount - 1">...</span>
        <a href="javascript:;" v-if="pageData.end < pageData.pageCount">{{ pageData.pageCount }}</a>
        <a href="javascript:;">下一页</a>
        <h1>{{ pageData }}</h1>
    </div>
</template>
<script>

import { ref, computed, toRefs } from 'vue'
export default {
    name: 'XtxPagination',
    props: {
        pageNo: {
            type: [Number, String],
            default: 1
        },
        pageSize: {
            type: [Number, String],
            default: 3
        },
        total: {
            type: [Number, String],
            default: 91
        },
        continues: {
            type: [Number, String],
            default: 5
        }
    },


    // pageNo:当前是第几页
    // pageSize：每一页显示多少条
    // total ：总页数
    // continues ：显示多少个按钮
    // 总页数   

    setup(props) {


        // 1 2 3 4 5
        // 1 2 3 4 5
        // 1 2 3 4 5
        // 2 3 4 5 6


        // 1
        // 1 2 3 4 5
        // 2
        // 1 2 3 4 5
        // 3
        // 1 2 3 4 5
        // 4
        // 2 3 4 5 6






        let { pageNo, pageSize, total, continues } = toRefs(props)

        let Select = ref(pageNo)



        // 首先需要计算出总页数
        let pageData = computed(() => {

            // 声明两个起始值和结束值
            let start = 0, end = 0

            //01： 计算出来的总的页数
            let pageCount = Math.ceil(total.value / pageSize.value)


            //02【不正常情况】 比如传递过的数据只有 4页 而需要显示的按钮是5页  
            // 所以需要判断总页数是否小于了 按钮数量 
            if (continues.value > pageCount) {
                // 设置起始页为 1
                start = 1
                // 设置结束页面为按钮的数量
                end = pageCount
            } else {
                //【03】 正常情况
                // 这里就是 比如 当前页是第 6页面
                //  4 5 6 7 8  相当于 -2 +2
                start = pageNo.value - Math.floor(continues.value / 2)
                end = pageNo.value + Math.floor(continues.value / 2)


                //【04】 这里是开头不正常情况
                // 比如当前页面是第一页
                // -1 0 1 2 3
                // 比如当前页面是第二页
                // 0 1 2 3 4 5
                if (start < 1) {
                    // 设置起始页为 1 结束页为 
                    start = 1
                    end = continues.value
                }


                //【05】 这里是结尾不正常的情况
                // 比如当前总页数只有11页
                // 比如当前页面是在 10 页面(错误)
                // 8 9 10 11 12
                // 比如当前页面是在 11 页面(错误)
                // 9 10 11 12 13
                if (end > pageCount) {
                    // 设置结束页面为计算出来的按钮数量
                    end = pageCount
                    // 设置结束按钮的数据 = (总页数 减去 按钮的数量) = 6 加上 （需要现实的按钮数量5 / 2 == 2） = 8  
                    start = (pageCount - continues.value) + Math.floor(continues.value / 2) - 1
                }

            }
            return { pageCount, start, end }
        })





        return { pageData, Select }




    }






    // page = 3,4,5,6,7 
    // page = 2,3,4,5,6 
    // page = 1,2,3,4,5
    // page = 2,3,4,5,6





}
</script>
<style scoped lang="less">
.xtx-pagination {
    display: flex;
    justify-content: center;
    padding: 30px;

    >a {
        display: inline-block;
        padding: 5px 10px;
        border: 1px solid #e4e4e4;
        border-radius: 4px;
        margin-right: 10px;

        &:hover {
            color: @xtxColor;
        }

        &.active {
            background: @xtxColor;
            color: #fff;
            border-color: @xtxColor;
        }

        &.disabled {
            cursor: not-allowed;
            opacity: 0.4;

            &:hover {
                color: #333
            }
        }
    }

    >span {
        margin-right: 10px;
    }
}
</style>