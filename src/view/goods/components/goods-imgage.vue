<template>
    <div class="goods-comment-image">
        <div class="list" v-if="pictures">
            <a :class="{ active: basUrl == items }" href="javascript:;" v-for="items in pictures" :key=items
                @click="hcangeImg(items)">
                <img v-lazy="items" alt="">
            </a>
        </div>
        <div class="preview" v-if="basUrl">
            <h1 @click="basUrl = null">X</h1>
            <img :src="basUrl" alt="">
            <div class="btn">
                <button @click="AddchangeBtn(0)">上一张</button>
                <button @click="AddchangeBtn(1)">下一张</button>
            </div>
        </div>
    </div>
</template>
<script>
import { ref } from 'vue'


export default {
    name: 'GoodsImages',
    props: {
        pictures: {
            type: Array,
            default: () => []
        }
    },
    setup(props) {
        // 图片地址
        let basUrl = ref(null)



        let hcangeImg = (url) => {
            basUrl.value = url
        }


        // 按钮上下切换
        let AddchangeBtn = (type) => {
            let index = props.pictures.indexOf(basUrl.value)
            if (type == 1) {
                index++
                if (index >= props.pictures.length) index = 0
            } else if (type == 0) {
                index--
                if (index < 0) index = props.pictures.length - 1
            }
            basUrl.value = props.pictures[index]
        }



        return { basUrl, hcangeImg, AddchangeBtn }

    }

}
</script>



<style scoped lang="less">
.goods-comment-image {
    .list {
        display: flex;
        flex-wrap: wrap;
        margin-top: 10px;

        a {
            width: 120px;
            height: 120px;
            border: 1px solid #e4e4e4;
            margin-right: 20px;
            margin-bottom: 10px;

            img {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }

            &.active {
                border-color: @xtxColor;
            }
        }
    }
}

.preview {
    width: 600px;
    height: 400px;
    display: flex;
    flex-direction: column;

    img {
        width: auto;
        height: auto;
        object-fit: contain;
        margin: 20px;
    }

    .btn {
        margin: 10px;
    }
}

.active {
    border: 4px solid @xtxColor;

}
</style>