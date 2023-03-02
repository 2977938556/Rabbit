<template>
    <div class="home-panel">
        <div class="container">
            <div class="head">
                <h3>{{ title }}<small>{{ subTitle }}</small></h3>
                <!-- 这里是命名插槽放置 右侧内容的区域 -->
                <slot name="right" />
            </div>
            <!--  这个是默认的插槽 -->
            <slot />
        </div>
    </div>
</template>



<script>
export default {
    props: {
        // 一级标题
        title: {
            type: String,
            default: () => "新鲜好物"
        },
        // 二级标题
        subTitle: {
            type: String,
            default: () => "新鲜出品,品质靠谱"
        }
    }
}
</script>



<style lang="less" scoped>
.home-panel {
    background-color: #fff;

    .head {
        padding: 40px 0;
        display: flex;
        align-items: flex-end;

        h3 {
            flex: 1;
            font-size: 32px;
            font-weight: normal;
            margin-left: 6px;
            height: 35px;
            line-height: 35px;

            small {
                font-size: 16px;
                color: #999;
                margin-left: 20px;
            }
        }
    }
}
</style>