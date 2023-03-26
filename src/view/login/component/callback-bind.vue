<template>
    <Form ref="formCom" class="xtx-form" :validation-schema="mySchema" v-slot="{ errors }">
        <div class="user-info">
            <img :src="avatar" alt="" />
            <p>Hi，{{ nickname }} 欢迎来小兔鲜，完成绑定后可以QQ账号一键登录哦~</p>
        </div>
        <div class="xtx-form-item">
            <div class="field">
                <i class="icon iconfont icon-phone"></i>
                <Field :class="{ err: errors.mobile, input: true }" name="mobile" v-model="form.mobile" type="text"
                    placeholder="绑定的手机号" />
            </div>
            <div v-if="errors.mobile" class="error">{{ errors.mobile }}</div>
        </div>
        <div class="xtx-form-item">
            <div class="field">
                <i class="icon iconfont icon-code"></i>
                <Field :class="{ err: errors.code, input: true }" name="code" type="text" v-model="form.code"
                    placeholder="短信验证码" />
                <span :class="{ disabled: countdown > 0, code: true }" @click="send">{{ countdown > 0 ? `${countdown}秒重新发送`
                    : '发送验证码' }}</span>
            </div>
            <div v-if="errors.code" class="error">{{ errors.code }}</div>
        </div>
        <a href="javascript:;" class="submit" @click="binding">立即绑定</a>
    </Form>
</template>
  
<script>

// 导入模块
import { Form, Field } from 'vee-validate'

// 导入校验数据
import veeSchema from '@/utils/vee-validate-schema.js'

// 导入消息提示组件
import Message from '@/components/libray/Message.js'

// 导入请求函数
import { userQQBindCode, userQQBindLogin } from '@/api/user.js'

import { reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'




export default {
    name: 'CallbackBind',
    components: { Form, Field },
    props: {
        avatar: {
            type: String,
            default: "http://thirdqq.qlogo.cn/qqopen/phxy9WNgIwyNAhHbeVuMHcMP6A4HHwLn8yRj7Cm4S8g3nkb9TQjoTXlCfUKEdmkd/100?v=8f33"
        },
        nickname: {
            type: String,
            default: "小兔仙儿",
        },
        openId: {
            type: [String, Number],
            default: ""
        }
    },
    setup(props) {

        let store = useStore()
        let router = useRouter()
        let route = useRoute()

        // 定义校验规则
        let mySchema = {
            mobile: veeSchema.mobile,
            code: veeSchema.code
        }


        // 定义数据
        let form = reactive({
            mobile: null,
            code: null
        })




        // 点击发送验证码
        // 点击的时候需要校验手机号是否符合要求

        //  倒计时
        let countdown = ref(0)
        // 定时器
        let time = null
        // form 元素
        let formCom = ref(null)
        // 倒计时逻辑
        let send = async () => {
            // 获取手机号是否格式正确
            let diagonse = mySchema.mobile(form.mobile)

            // 这里是成功的状态
            if (typeof diagonse == "boolean") {
                // 这里必须是倒计时为0的时候才能发送数据
                if (countdown.value == 0) {
                    countdown.value = 10
                    // 这里由于可能用户会多次点击发送验证码导致报错
                    try {
                        let mobileCode = await userQQBindCode(form.mobile)
                        Message({ type: "success", text: "发送验证码成功" })
                    } catch ({ response }) {
                        Message({ type: "error", text: response.data.message })
                    }

                }
                // 定时器递减
                time = setInterval(() => {
                    countdown.value--
                    if (countdown.value <= 0) {
                        clearInterval(time)
                        countdown.value = 0
                    }
                }, 1000);

            } else {
                // 这里是不成功的状态
                formCom.value.setFieldError('mobile', valid)
            }
        }




        // 绑定手机号

        let binding = async () => {
            // 返回是否全部校验成功
            let valve = await formCom.value.validate()

            // 判断是否验证手机号成功
            if (valve) {
                // 这里有bug
                userQQBindLogin({ unionId: props.openId, mobile: form.mobile, code: form.code }).then(({ result }) => {
                    //02： 数据本地化存储
                    store.commit('user/setUser', { id: result.id, avatar: result.avatar, nickname: result.nickname, account: result.account, mobile: result.mobile, token: result.token })


                    // 清空本地的购物车 已经合并到云端了
                    store.dispatch('cart/mergeLocalCart').then(() => {
                        // //03：显示提示
                        Message(({ type: 'success', text: '绑定成功' }))
                        // //04：跳转路由 如果是从其他页面跳进来的那么登录成功后就会跳转到回去
                        router.push(route.query.redirectUrl || '/')
                    })


                }).catch(({ response }) => {
                    // 这里是提示错误的数据
                    Message({ type: "error", text: response.data.message })
                })

            } else {
                Message({ type: "error", text: '绑定失败请重新设置' })
            }
        }










        return { mySchema, form, send, formCom, countdown, binding }
    }











}
</script>



  
<style scoped lang='less'>
.user-info {
    width: 320px;
    height: 70px;
    margin: 0 auto;
    display: flex;
    background: #f2f2f2;
    align-items: center;
    padding: 0 10px;
    margin-bottom: 25px;

    img {
        background: #f2f2f2;
        width: 50px;
        height: 50px;
    }

    p {
        padding-left: 10px;
    }
}

.code {
    position: absolute;
    right: 0;
    top: 0;
    line-height: 50px;
    width: 80px;
    color: #999;

    &:hover {
        cursor: pointer;
    }
}

.disabled {
    width: auto;
    pointer-events: none;
    cursor: not-allowed;
}
</style>