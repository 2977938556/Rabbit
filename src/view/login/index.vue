<template>
    <div class="page-login">
        <LoginHeader></LoginHeader>
        <section class="login-section">
            <div class="wrapper">
                <nav>
                    <a @click="Selected = true" href="javascript:;" :class="{ active: Selected == true }">账户登录</a>
                    <a @click="Selected = false" href="javascript:;" :class="{ active: Selected == false }">扫码登录</a>
                </nav>
                <!-- 表单 -->
                <div v-if="Selected" class="account-box">
                    <LoginFrom />
                </div>
                <!-- 二维码 -->
                <div v-else class="qrcode-box">
                    <img src="@/assets/images/qrcode.jpg" alt="">
                    <p>打开 <a href="javascript:;">小兔鲜App</a> 扫码登录</p>
                </div>



            </div>
        </section>
        <LoginFooter></LoginFooter>
    </div>
</template>
<script>
// 导入头部组件
import LoginHeader from './component/login-header.vue'
import LoginFooter from './component/login-footer.vue'


// 表单组件
import LoginFrom from './component/login-from.vue'


import { ref } from 'vue'



export default {
    name: 'PageLogin',
    components: { LoginHeader, LoginFooter, LoginFrom },

    setup() {
        // 切换效果 手机登录与短信登录
        let Selected = ref(true)

        console.log(QC)



        return { Selected }




    }







}
</script>
<style scoped lang="less">
.login-section {
    background: url(../../assets/images/login-bg.png) no-repeat center / cover;
    height: 488px;
    position: relative;

    .wrapper {
        width: 380px;
        background: #fff;
        min-height: 400px;
        position: absolute;
        left: 50%;
        top: 54px;
        transform: translate3d(100px, 0, 0);
        box-shadow: 0 0 10px rgba(0, 0, 0, .15);

        nav {
            height: 55px;
            border-bottom: 1px solid #f5f5f5;
            display: flex;
            padding: 0 40px;
            text-align: right;
            align-items: center;

            a {
                flex: 1;
                line-height: 1;
                display: inline-block;
                font-size: 18px;
                position: relative;

                &:first-child {
                    border-right: 1px solid #f5f5f5;
                    text-align: left;
                }

                &.active {
                    color: @xtxColor;
                    font-weight: bold;
                }
            }
        }

        // 二维码容器
        // 二维码容器
        .qrcode-box {
            text-align: center;
            padding-top: 40px;

            p {
                margin-top: 20px;

                a {
                    color: @xtxColor;
                    font-size: 16px;
                }
            }
        }


    }
}
</style>


