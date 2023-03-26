<template>
    <div class="cart-sku" ref="target">
        <div class="attrs">
            <span class="ellipsis" @click="change()">{{ attrsText }}</span>
            <i class="iconfont icon-angle-down"></i>
        </div>
        <div class="layer" v-if="visible">
            <!-- 数据加载中的情况loding状态 -->
            <div class="loading" v-if="loding"></div>
            <GoodsSku v-if="goods" :skuid="skuId" :goods="goods" @changeSku="changeSku" />
            <XtxButton v-if="goods" type="primary" size="mini" style="margin-left:60px" @click="submit">确认</XtxButton>
        </div>
    </div>
</template>
<script>
import { getCurrentInstance, ref } from "vue"
// 导入点击其他地方会关闭
import { onClickOutside } from "@vueuse/core"
// 导入获取数据方法
import { getSpecsAndSkus } from "@/api/cart.js"
// 导入sku选择组件
import GoodsSku from "@/view/goods/components/goods-sku.vue"

export default {
    name: "CartSku",
    props: {
        attrsText: {
            type: String,
            default: "",
        },
        skuId: {
            type: [Number, String],
        },
    },
    components: { GoodsSku },

    setup(props, { emit }) {
        // 控制外部的盒子显示与隐藏
        let visible = ref(false)
        // 控制loding加载状态
        let loding = ref(false)
        // 手机商品数据
        let goods = ref(null)



        // 打开
        let open = () => {
            // 显示下拉菜单
            visible.value = true;
            // 显示加载状态
            loding.value = true
            // 获取数据
            getSpecsAndSkus(props.skuId).then(({ result }) => {
                // 赋值给goods变量
                goods.value = result

                // 关闭加载状态
                loding.value = false
            })
        };

        // 关闭
        let close = () => {
            visible.value = false
        }

        // 切换
        let change = () => {
            visible.value ? close() : open()
        };

        let target = ref(null)
        // 这个是点击选择款外部的内容就关闭掉
        onClickOutside(target, () => {
            close()
        });


        // currSku 保存修改的sku的值
        let currSku = ref(null)

        // 获取sku传递的参数
        let changeSku = (val) => {
            currSku.value = val
        }

        // 点击确认按钮的时候
        // 传递给父级需要有几个条件 比如不能为空  skuid信息有 skuid不能等于当前已经选择的skuid
        let submit = () => {
            if (currSku.value && currSku.value.skuId && currSku.value.skuId !== props.skuId) {
                emit("change", currSku.value)
            }
            close()
        }

        return { change, visible, target, loding, goods, changeSku, submit }
    },
};
</script>
<style scoped lang="less">
.cart-sku {
    height: 28px;
    border: 1px solid #f5f5f5;
    padding: 0 6px;
    position: relative;
    margin-top: 10px;
    display: inline-block;

    .attrs {
        line-height: 24px;
        display: flex;

        span {
            max-width: 230px;
            font-size: 14px;
            color: #999;
        }

        i {
            margin-left: 5px;
            font-size: 14px;
        }
    }

    .layer {
        position: absolute;
        left: -1px;
        top: 40px;
        z-index: 10;
        width: 400px;
        height: auto;
        border: 1px solid @xtxColor;
        box-shadow: 2px 2px 4px lighten(@xtxColor, 50%);
        background: #fff;
        border-radius: 4px;
        font-size: 14px;
        padding: 20px;

        &::before {
            content: "";
            width: 12px;
            height: 12px;
            border-left: 1px solid @xtxColor;
            border-top: 1px solid @xtxColor;
            position: absolute;
            left: 12px;
            top: -8px;
            background: #fff;
            transform: scale(0.8, 1) rotate(45deg);
        }

        .loading {
            height: 224px;
            background: url(../../../assets/images/loading.gif) no-repeat center;
        }
    }
}
</style>
