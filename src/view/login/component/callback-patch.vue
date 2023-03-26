<template>
    <Form ref="formCom" class="xtx-form" :validation-schema="Schema" v-slot="{ errors }">
        <div class="xtx-form-item">
            <div class="field">
                <i class="icon iconfont icon-user"></i>
                <Field :class="{ input: errors.account, input: true }" name="account" v-model="form.account" type="text"
                    placeholder="请输入用户名" />
            </div>
            <div v-if="errors.account" class="error">{{ errors.account }}</div>
        </div>
        <div class="xtx-form-item">
            <div class="field">
                <i class="icon iconfont icon-phone"></i>
                <Field :class="{ input: errors.mobile, input: true }" name="mobile" v-model="form.mobile" type="text"
                    placeholder="请输入手机号" />
            </div>
            <div v-if="errors.mobile" class="error">{{ errors.mobile }}</div>
        </div>
        <div class="xtx-form-item">
            <div class="field">
                <i class="icon iconfont icon-code"></i>
                <Field :class="{ input: errors.code, input: true }" name="code" v-model="form.code" type="text"
                    placeholder="请输入验证码" />
                <span :class="{ disabled: countdown > 0, code: true }" @click="send">{{ countdown > 0 ? `${countdown}发送验证码`
                    :
                    '发送验证码' }}</span>
            </div>
            <div v-if="errors.code" class="error">{{ errors.code }}</div>
        </div>
        <div class="xtx-form-item">
            <div class="field">
                <i class="icon iconfont icon-lock"></i>
                <Field :class="{ input: errors.password, input: true }" name="password" v-model="form.password"
                    type="password" placeholder="请输入密码" />
            </div>
            <div v-if="errors.password" class="error">{{ errors.password }}</div>
        </div>
        <div class="xtx-form-item">
            <div class="field">
                <i class="icon iconfont icon-lock"></i>
                <Field :class="{ input: errors.rePassword, input: true }" name="rePassword" v-model="form.rePassword"
                    type="password" placeholder="请确认密码" />
            </div>
            <div v-if="errors.rePassword" class="error">{{ errors.rePassword }}</div>
        </div>
        <a href="javascript:;" class="submit" @click="userSubmit">立即提交</a>
    </Form>
</template>
  
<script>

// 导入模块
import { Form, Field } from 'vee-validate'

// 导入校验数据
import veeSchema from '@/utils/vee-validate-schema.js'
// 导入api
import { userQQBindCode, userQQbindLogin } from '@/api/user.js'

// 导入消息提示组件
import Message from '@/components/libray/Message.js'
import { reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'







export default {
    name: 'CallbackPatch',
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



        // 设置验证数据
        let form = reactive({
            account: null,
            mobile: null,
            code: null,
            password: null,
            rePassword: null
        })
        // 设置规则
        let Schema = {
            account: veeSchema.accountApi,
            mobile: veeSchema.mobile,
            code: veeSchema.code,
            password: veeSchema.password,
            rePassword: veeSchema.rePassword
        }


        let formCom = ref(null)


        // 倒计时
        let countdown = ref(0)
        let tirm = null
        let send = async () => {
            // 必须要在倒计时为0的时候发送 因为0表示可以发送验证码、
            // 发送完成后 倒计时<=0的时候就需要设置为01

            let valve = Schema.mobile(form.mobile)

            // 判断手机号是否有错没有错那么就发送验证码
            if (typeof valve === 'boolean') {

                // 必须要时间为0的时候才能发送验证码
                if (countdown.value == 0) {
                    countdown.value = 10
                    try {
                        let data = await userQQBindCode(form.mobile)
                        Message({ type: "success", text: "发送成功" })
                        // 定时器
                        tirm = setInterval(() => {
                            countdown.value--
                            if (countdown.value <= 0) {
                                countdown.value = 0
                                clearInterval(tirm)
                            }
                        }, 1000)

                    } catch ({ response }) {
                        countdown.value = 0
                        clearInterval(tirm)

                        Message({ type: "error", text: response.data.message })
                    }


                }





            } else {
                formCom.value.setFieldError('mobile', valve)
            }
        }
        // 提交混合绑定的数据
        let userSubmit = async () => {

            // 返回是否全部校验成功
            let valve = await formCom.value.validate()

            // 首先判断所有的数据是都ok
            if (valve) {
                try {
                    // 01 发送注册请求
                    let { result } = await userQQbindLogin({ unionId: props.openId, ...form })
                    //02： 数据本地化存储
                    store.commit('user/setUser', { id: result.id, avatar: result.avatar, nickname: result.nickname, account: result.account, mobile: result.mobile, token: result.token })

                    // 登录成功的话清空本地的购物车 已经合并到云端了
                    store.dispatch('cart/mergeLocalCart').then(() => {
                        // //03：显示提示
                        Message(({ type: 'success', text: '登录成功' }))
                        // //04：跳转路由 如果是从其他页面跳进来的那么登录成功后就会跳转到回去
                        router.push(route.query.redirectUrl || '/')
                    })

                } catch ({ response }) {
                    Message(({ type: 'success', text: response.data.message }))
                }
            }
        }
        return { form, Schema, send, formCom, countdown, userSubmit }

    }



}
</script>
  
<style scoped lang='less'>
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