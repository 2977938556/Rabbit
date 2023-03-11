<template>
    <div class="xtx-city" ref="target">
        <div class="select">
            <span class="placeholder" @click="targetOpen" v-if="!fullLocation">选择你的收货地址</span>
            <span class="value" @click="targetOpen" v-else>{{ fullLocation }}</span>
            <i class="iconfont icon-angle-down"></i>
        </div>
        <div class="option" v-if="active">
            <div class="loading" v-if="loding">正在加载中</div>
            <template v-else>
                <span class="ellipsis" v-for="item in currList" :key="item.code" @click="changeItem(item)">{{ item.name
                }}</span>
            </template>
        </div>
    </div>
</template>


<script>
import axios from 'axios'
import { ref, reactive, computed } from 'vue'
import { onClickOutside } from '@vueuse/core'
export default {
    name: 'XtxCity',
    props: {
        fullLocation: {
            type: String,
            default: "",
        }
    },
    setup(props, { emit }) {

        // 显示与隐藏
        let active = ref(false)

        // loding 状态
        let loding = ref(false)

        // 位置信息[最终存储数据的]
        let cityList = ref([])


        // 开启
        let open = () => {
            for (let key in changeResult) {
                changeResult[key] = ''
            }
            active.value = true
            loding.value = true

            // 首先获取数据
            getCityData().then(res => {
                cityList.value = res;
                loding.value = false
            })
        }


        // 关闭
        let clone = () => {
            active.value = false
        }


        // 切换
        let targetOpen = () => {
            if (active.value) {
                clone()
            } else {
                open()
            }
        }

        // 在元素外部隐藏
        let target = ref(null)
        onClickOutside(target, () => {
            clone();
        })



        // 这个是处理拼接的数据
        const changeResult = reactive({
            provinceCode: '',
            provinceName: '',
            cityCode: '',
            cityName: '',
            countyCode: '',
            countyName: '',
            fullLocation: ''
        })


        // 处理点击事件
        const changeItem = (item) => {
            // 这里分别判断省市区
            // 省
            if (item.level === 0) {
                changeResult.provinceCode = item.code;
                changeResult.provinceName = item.name;
            }
            // 市
            if (item.level === 1) {
                changeResult.cityCode = item.code;
                changeResult.cityName = item.name;

            }
            // 区
            if (item.level === 2) {
                changeResult.countyCode = item.code;
                changeResult.countyName = item.name;


                // 拼接数据
                changeResult.fullLocation = `${changeResult.provinceName} ${changeResult.cityName} ${changeResult.countyName}`
                clone()
                emit('change', changeResult)
            }
        }


        // 处理计算的数据
        const currList = computed(() => {
            // 将地区数据赋值给一个新变量

            // 省这个级别 因为默认数据就是省级别
            let lists = cityList.value

            if (changeResult.provinceCode) {
                lists = lists.find(item => item.code == changeResult.provinceCode).areaList
            }

            // 判断是否在市这个级别
            if (changeResult.cityCode) {
                lists = lists.find(item => item.code == changeResult.cityCode).areaList
            }

            // 判断是否在市这个级别
            if (changeResult.countyCode) {
                lists = lists.find(item => item.code == changeResult.countyCode).areaList
            }
            return lists
        })


        return { target, active, open, clone, targetOpen, loding, cityList, changeItem, currList }
    }
}


// 获取城市数据
// 1. 数据在哪里？https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json
// 2. 何时获取？打开城市列表的时候，做个内存中缓存
// 3. 怎么使用数据？定义计算属性，根据点击的省份城市展示
let getCityData = () => {
    return new Promise((resolve, reject) => {
        if (window.cityData) {
            return resolve(window.cityData)
        } else {
            axios.get("https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json").then(({ data }) => {
                // 返回数据之前缓存数据
                window.cityData = data;
                return resolve(window.cityData)
            })
        }

    })
}






</script>



<style scoped lang="less">
.xtx-city {
    display: inline-block;
    position: relative;
    z-index: 400;

    .select {
        border: 1px solid #e4e4e4;
        height: 30px;
        padding: 0 5px;
        line-height: 28px;
        cursor: pointer;

        &.active {
            background: #fff;
        }

        .placeholder {
            color: #999;
        }

        .value {
            color: #666;
            font-size: 12px;
        }

        i {
            font-size: 12px;
            margin-left: 5px;
        }
    }

    .option {
        width: 542px;
        border: 1px solid #e4e4e4;
        position: absolute;
        left: 0;
        top: 29px;
        background: #fff;
        min-height: 30px;
        line-height: 30px;
        display: flex;
        flex-wrap: wrap;
        padding: 10px;

        .loading {
            height: 290px;
            width: 100%;
            text-align: center;
            line-height: 100px;
            background: url(../../assets/images/loading.gif) no-repeat center;
        }

        >span {
            width: 130px;
            text-align: center;
            cursor: pointer;
            border-radius: 4px;
            padding: 0 3px;

            &:hover {
                background: #f5f5f5;
            }
        }
    }
}
</style>

