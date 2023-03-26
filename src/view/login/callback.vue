<template>
    <LoginHeader>联合登录</LoginHeader>

    <!-- 已经绑定账户那么就会显示这个并跳转到首页获取重定向页面 -->
    <section class="container" v-if="isBind">
        <div class="unbind">
            <div class="loading"></div>
        </div>
    </section>


    <!-- 未绑定的情况下会出现这个 -->
    <section class="container" v-else>
        <nav class="tab">
            <a :class="{ active: hasAccount == true }" @click="hasAccount = true" href="javascript:;">
                <i class="iconfont icon-bind" />
                <span>已有小兔鲜账号，请绑定手机</span>
            </a>
            <a href="javascript:;" :class="{ active: hasAccount == false }" @click="hasAccount = false">
                <i class="iconfont icon-edit" />
                <span>没有小兔鲜账号，请完善资料</span>
            </a>
        </nav>

        <!-- 这个是qq登录成功但是没有绑定手机号 -->
        <div class="tab-content" v-if="hasAccount">
            <CallbackBind :avatar="avatar" :nickname="nickname" :openId="openId" />
        </div>
        <!-- 这个是qq登录但是没有注册账户 -->
        <div class="tab-content" v-else>
            <CallbackPatch :avatar="avatar" :nickname="nickname" :openId="openId" />
        </div>
    </section>

    <LoginFooter />
</template>
  
<script>

import { ref } from 'vue'

// 导入的组件
// 头部组件
import LoginHeader from './component/login-header.vue'
// 尾部组件
import LoginFooter from './component/login-footer.vue'
// 有账户但是没有绑定手机号
import CallbackBind from './component/callback-bind.vue'
// 未注册需要设置个人信息
import CallbackPatch from './component/callback-patch.vue'


import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'



// 获取数据方法
import { userQQLogin } from '@/api/user'
// 提示框
// import Message from '@/components/library/Message'

export default {
    name: 'PageCallback',
    components: { LoginHeader, LoginFooter, CallbackBind, CallbackPatch },
    setup(props) {
        let store = useStore()
        let router = useRouter()
        let route = useRoute()




        // 控制绑定的显示隐藏
        const hasAccount = ref(true)
        // 假设已经绑定，就会先进入加载页面如果登录失败证明未绑定。
        const isBind = ref(true)




        // 是qq登录那么就需要获取id及其头像
        // 头像
        const avatar = ref(null)
        // 设置头像
        const nickname = ref(null)
        // QQ的openId
        const openId = ref(null)



        // 先判断qq登录的状态 
        // 如果qq登录成功 那么就获取openId 
        // 有了openId 之后就可以发送给后台


        //01： 判断是否已经QQ登录
        if (window.qc.Login.check()) {
            //02： 登录了那么就获取QQ的openId
            QC.Login.getMe(async (id) => {
                openId.value = id
                //03：这里是一个qq登录成功的
                try {
                    //04: 传递id给服务器进行判断
                    let { result } = await userQQLogin(id)
                    //05： 数据本地化存储
                    store.commit('user/setUser', { id: result.id, avatar: result.avatar, nickname: result.nickname, account: result.account, mobile: result.mobile, token: result.token })
                    // 登录成功的话清空本地的购物车 已经合并到云端了
                    store.dispatch('cart/mergeLocalCart').then(() => {
                        // //03：显示提示
                        Message(({ type: 'success', text: '登录成功' }))
                        // //04：跳转路由 如果是从其他页面跳进来的那么登录成功后就会跳转到回去
                        router.push(route.query.redirectUrl || '/')
                    })
                } catch (e) {
                    // 这里是qq登录失败
                    // 这里是后台会返回一个错误的状态就会进入到这里面 然后显示需要绑定手机号

                    getQQIdandImg()
                    isBind.value = false
                }
            })
        }




        let getQQIdandImg = () => {
            QC.api('get_user_info').success(({ data }) => {
                avatar.value = data.figureurl_1
                nickname.value = data.nickname
            })
        }










        return { hasAccount, nickname, avatar, isBind, openId }
    }
}
</script>
  
<style scoped lang='less'>
.container {
    padding: 25px 0;
}

.tab {
    background: #fff;
    height: 80px;
    padding-top: 40px;
    font-size: 18px;
    text-align: center;

    a {
        color: #666;
        display: inline-block;
        width: 350px;
        line-height: 40px;
        border-bottom: 2px solid #e4e4e4;

        i {
            font-size: 22px;
            vertical-align: middle;
        }

        span {
            vertical-align: middle;
            margin-left: 4px;
        }

        &.active {
            color: @xtxColor;
            border-color: @xtxColor;
        }
    }
}

.tab-content {
    min-height: 600px;
    background: #fff;
}



// loding 加载状态
.container {
    padding: 25px 0;
    position: relative;
    height: 730px;

    .unbind {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        padding: 25px 0;
        z-index: 99;

        .loading {
            height: 100%;
            background: #fff url(../../assets/images/load.gif) no-repeat center / 100px 100px;
        }
    }
}
</style>