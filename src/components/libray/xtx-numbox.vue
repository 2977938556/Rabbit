<template>
    <div class="xtx-numbox">
        <div class="label">{{ label }}</div>
        <div class="numbox">
            <a href="javascript:;" @click="numChange(-1)">-</a>
            <input type="text" readonly :value="modelValue">
            <a href="javascript:;" @click="numChange(1)">+</a>
        </div>
    </div>
</template>
<script>
import { registerRuntimeCompiler } from 'vue'
export default {
    name: 'XtxNumbox',
    props: {
        label: {
            type: String,
            default: "数量"
        },
        modelValue: {
            type: Number,
            default: 1
        },
        min: {
            type: Number,
            default: 1
        },
        max: {
            type: Number,
        }
    },

    setup(props, { emit }) {
        let numChange = (val) => {
            // 这里得到计算后的值
            let newValue = props.modelValue + val
            // 这里符合条件的就禁止修改数据了
            if (newValue < props.min || newValue > props.max) return

            let count = newValue;
            emit('change', count)
        }

        return { numChange }
    }

}
</script>


<style scoped lang="less">
.xtx-numbox {
    display: flex;
    align-items: center;

    .label {
        width: 60px;
        color: #999;
        padding-left: 10px;
    }

    .numbox {
        width: 120px;
        height: 30px;
        border: 1px solid #e4e4e4;
        display: flex;

        >a {
            width: 29px;
            line-height: 28px;
            text-align: center;
            background: #f8f8f8;
            font-size: 16px;
            color: #666;

            &:first-of-type {
                border-right: 1px solid #e4e4e4;
            }

            &:last-of-type {
                border-left: 1px solid #e4e4e4;
            }
        }

        >input {
            width: 60px;
            padding: 0 5px;
            text-align: center;
            color: #666;
        }
    }
}
</style>