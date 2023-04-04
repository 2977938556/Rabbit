<template>
    <div class='home-skeleton'>
        <div class="item" v-for="i in 5" :key="i" :style="{ backgroundColor: bg }">
            <XtxSkeleton bg="#e4e4e4" width="1000px" height="190px" animated />
        </div>
    </div>
</template>
  
<script>
export default {
    name: 'OrderItem',
    props: {
        bg: {
            type: String,
            default: '#fff'
        }
    }
}
</script>
  
<style scoped lang='less'>
.home-skeleton {
    width: auto;
    height: 406px;
    // display: flex;
    // flex-direction: column;
    // justify-content: space-between;

    .item {
        width: 306px;
        padding: 10px;

        .xtx-skeleton~.xtx-skeleton {
            display: block;
            margin: 40px auto 0;
        }
    }
}
</style>