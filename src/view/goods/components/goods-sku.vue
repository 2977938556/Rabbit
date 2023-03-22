<template>
    <div class="goods-sku">
        <dl v-for="item in  goods.specs" :key="item.id">
            <dt>{{ item.name }}</dt>
            <dd>
                <template v-for="val in item.values" :key="val.name">
                    <img v-if="val.picture" :class="{ selected: val.selected, disabled: val.disabled }"
                        @click="clickSpecs(item, val)" :src="val.picture" :title="val.name">
                    <span v-else :class="{ selected: val.selected, disabled: val.disabled }" @click="clickSpecs(item, val)"
                        :title="val.name">{{
                            val.name
                        }}</span>
                </template>
            </dd>
        </dl>
    </div>
</template>
<script>


// 大致步骤：

// 根据后台返回的skus数据得到有效sku组合
// 根据有效的sku组合得到所有的子集集合
// 根据子集集合组合成一个路径字典，也就是对象。
// 在组件初始化的时候去判断每个规格是否点击
// 在点击规格的时候去判断其他规格是否可点击
// 判断的依据是，拿着说有规格和现在已经选中的规则取搭配，得到可走路径。


// 导入的是算法
import getPowerSet from '@/vender/power-set'
import { useStore } from 'vuex'
// 拼接的字符串
const spliter = '★'




// 生成字典
let getPathMap = (sku) => {
    // 字典
    let pathMap = {}

    //01 循环遍历里面的元素
    sku.forEach(item => {
        //02 筛选出是否有库存的数据
        if (item.inventory) {
            //03  获取子集的数据值[获取有效的sku组合]
            let specs = item.specs.map(spec => spec.valueName)
            //04 根据有效的组合生成子集 这里都是对象
            let powerSet = getPowerSet(specs);

            // 遍历子集 
            powerSet.forEach(set => {
                // 由于有些子集数据是空的所以需要设置判断 
                if (set.length != 0) {
                    let key = set.join(spliter)
                    //05 这里是判断是否已经有数据 因为有些规格只有一个 比如 黑色   蓝色  日本等
                    if (pathMap[key]) {
                        pathMap[key].push(item.id)
                    } else {
                        // 这里是没有的情况下
                        pathMap[key] = [item.id]
                    }
                }
            });
        }
    })


    return pathMap

}



//得到当前选中规格集合
// 得到当前选中规格集合
const getSelectedArr = (specs) => {
    const selectedArr = []
    // 循环属性
    specs.forEach(spec => {
        // 筛选出被点击选中的数据  所以这里有的时候会返回有值有的时候会返回undefined
        const selectedVal = spec.values.find(val => val.selected)
        // 这里判断是否有值,如果有值那么就设置当前为name 否则设置为undefined
        selectedArr.push(selectedVal ? selectedVal.name : undefined)
        //(3) [undefined, '20cm', '日本'] 这是数据结构
    })
    return selectedArr
}


// 更新按钮的禁用状态
const updateDisabledStatus = (specs, pathMap) => {
    // 第一个参数是 按钮的规格集合数量
    // 第二个参数是 字典集合
    specs.forEach((spec, i) => {
        // 获取被点击的这个数据
        const selectedArr = getSelectedArr(specs)
        spec.values.forEach(val => {
            // 已经选中的按钮不用判断
            if (val.name === selectedArr[i]) return false
            // 未选中的替换对应的值
            selectedArr[i] = val.name
            //  过滤无效值 undefined 得到key
            const key = selectedArr.filter(v => v).join(spliter)
            // 设置禁用状态
            val.disabled = !pathMap[key]
        })
    })
}

// 初始化选中状态
let initSelectedStatus = (goods, skuid) => {
    // 找到了skuid中的数据
    let skusArr = goods.skus.find(item => item.id == skuid)
    if (skusArr) {
        // 遍历渲染的规格元素,每次遍历进行判断
        goods.specs.forEach((item, index) => {
            // 这里循环全部
            item.values.forEach((citem) => {
                // 这里判断是否会等于
                citem.selected = (citem.name == skusArr.specs[index].valueName)
            })

        })
    }

}
export default {
    name: 'GoodsSku',
    props: {
        goods: {
            type: Object,
            default: () => ({}),
        },
        skuid: {
            type: String,
            default: "",
        }
    },
    setup(props, { emit }) {
        // 初始化选择状态
        initSelectedStatus(props.goods, props.skuid)

        // 得到查询的字典
        let pathMap = getPathMap(props.goods.skus)

        //  组件初始化的时候更新禁用状态
        updateDisabledStatus(props.goods.specs, pathMap)

        // 点击事件
        let clickSpecs = (item, val) => {
            // 当被禁用了就禁止
            if (val.disabled) return

            // 当点击的时候 排他思想
            if (val.selected) {
                val.selected = false
            } else {
                // 先将该规格的集合全部的disabled修改为 false`
                item.values.forEach(d => {
                    d.selected = false
                })
                val.selected = true;
                // 点击的时候更新禁用状态
                updateDisabledStatus(props.goods.specs, pathMap)

                // 这里需要做的一件事情就是将数据传递给父级
                // 分别有这些数据
                // skuId: skuid
                // price: 价格
                // oldPrice: 原价
                // inventory: 拼接好的
                let skuidMath = getSelectedArr(props.goods.specs).filter(item => item)

                // 判断是否全部选中
                if (skuidMath.length == props.goods.specs.length) {
                    // 这里是得到已经选中的数据 ["黑色","中国","10cm"]  === "黑色⭐中国⭐10cm" 
                    // 再使用这个再字典中查找到skuids 再去props.goods.skus中获取对象
                    let skuids = pathMap[skuidMath.join(spliter)]

                    let sku = props.goods.skus.find(item => item.id == skuids[0])


                    // 传递参数
                    emit("changeSku", {
                        skuId: sku.id,//skuId
                        price: sku.price,// 价格
                        oldPrice: sku.oldPrice,// 历史价格
                        inventory: sku.inventory,// 库存
                        // 这个参数需要 属性名称1:属性值  属性名2 :属性值
                        valueName: sku.specs.reduce((a, b) => `${a} ${b.name}:${b.valueName}`, '').trim()// 拼接好的商品数据
                    })
                } else {
                    emit("changeSku", {})
                }

            }
        }




        // 这里是默认选中
        let miaoya = getSelectedArr(props.goods.specs).filter(item => item)
        // 判断是否全部选中
        if (miaoya.length == props.goods.specs.length) {
            // 这里是得到已经选中的数据 ["黑色","中国","10cm"]  === "黑色⭐中国⭐10cm" 
            // 再使用这个再字典中查找到skuids 再去props.goods.skus中获取对象
            let skuids = pathMap[miaoya.join(spliter)]

            let sku = props.goods.skus.find(item => item.id == skuids[0])

            // 传递参数
            emit("changeSku", {
                skuId: sku.id,//skuId
                price: sku.price,// 价格
                oldPrice: sku.oldPrice,// 历史价格
                inventory: sku.inventory,// 库存
                // 这个参数需要 属性名称1:属性值  属性名2 :属性值
                valueName: sku.specs.reduce((a, b) => `${a} ${b.name}:${b.valueName}`, '').trim()// 拼接好的商品数据
            })
        } else {
            emit("changeSku", {})
        }




        return { clickSpecs }

    }
}
</script>


<style scoped lang="less">
.sku-state-mixin () {
    border: 1px solid #e4e4e4;
    margin-right: 10px;
    cursor: pointer;

    &.selected {
        border-color: @xtxColor;
    }

    &.disabled {
        opacity: 0.6;
        border-style: dashed;
        cursor: not-allowed;
    }
}

.goods-sku {
    padding-left: 10px;
    padding-top: 20px;

    dl {
        display: flex;
        padding-bottom: 20px;
        align-items: center;

        dt {
            width: 50px;
            color: #999;
        }

        dd {
            flex: 1;
            color: #666;

            >img {
                width: 50px;
                height: 50px;
                .sku-state-mixin ();
            }

            >span {
                display: inline-block;
                height: 30px;
                line-height: 28px;
                padding: 0 20px;
                .sku-state-mixin ();
            }
        }
    }
}
</style>