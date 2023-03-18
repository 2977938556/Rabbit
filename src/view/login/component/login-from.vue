<template>
    <div class="account-box">

        <div class="toggle">
            <a href="javascript:;" v-if="FromFlage" @click="FromFlage = false">
                <i class="iconfont icon-user"></i> {{ FromFlage == true ? '使用短信登录' : "使用账号登录" }}
            </a>
            <a href="javascript:;" v-else @click="FromFlage = true">
                <i class="iconfont icon-msg"></i>{{ FromFlage == false ? '使用账号登录' : "使用短信登录" }}
            </a>
        </div>



        <Form ref="formCom" class="form" :validation-schema="mySchema" v-slot="{ errors }">
            <!-- 使用手机号登录 -->
            <template v-if="FromFlage">

                <div class="form-item">
                    <div class="input">
                        <i class="iconfont icon-user"></i>
                        <Field name="account" :class="{ error: errors.account }" type="text" placeholder="请输入用户名"
                            v-model="form.account" />
                    </div>
                    <div v-if="errors.account" class="error"><i class="iconfont icon-warning" />{{ errors.account }}</div>
                </div>

                <div class="form-item">
                    <div class="input">
                        <i class="iconfont icon-lock"></i>
                        <Field name="password" :class="{ error: errors.password }" type="password" placeholder="请输入密码"
                            v-model="form.password" />
                    </div>
                    <div v-if="errors.password" class="error"><i class="iconfont icon-warning" />{{ errors.password }}</div>
                </div>
            </template>


            <!-- 使用短信验证登录 -->
            <template v-else>
                <div class="form-item">
                    <div class="input">
                        <i class="iconfont icon-user"></i>
                        <Field name="mobile" type="text" placeholder="请输入手机号" v-model="form.mobile" />
                    </div>
                    <div v-if="errors.mobile" class="error"><i class="iconfont icon-warning" />{{ errors.mobile }}</div>
                </div>


                <div class="form-item">
                    <div class="input">
                        <i class="iconfont icon-code"></i>
                        <Field name="code" type="text" placeholder="请输入验证码" v-model="form.code" />
                        <span :class="{ disabled: time > 0, code: true }" @click="send">{{ time > 0 ?
                            `${time}秒重新发送` : "请发送验证码" }}</span>
                    </div>
                    <div v-if="errors.code" class="error"><i class="iconfont icon-warning" />{{ errors.code }}</div>

                </div>
            </template>

            <!-- 协议选中 -->
            <div class="form-item">
                <div class="agree">
                    <Field as="XtxCheckBox" name="isAgree" v-model="form.isAgree"></Field>
                    <span>我已同意</span>
                    <a href="javascript:;">《隐私条款》</a>
                    <span>和</span>
                    <a href="javascript:;">《服务条款》</a>
                    <div v-if="errors.isAgree" class="error"><i class="iconfont icon-warning" />{{ errors.isAgree }}</div>
                </div>
            </div>

            <!-- d登录按钮 -->
            <a href="javascript:;" @click="submit" class="btn">登录</a>



        </Form>
        <div class="action">
            <img src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png" alt="">
            <div class="url">
                <a href="javascript:;">忘记密码</a>
                <a href="javascript:;">免费注册</a>
            </div>
        </div>
    </div>
</template>




<script>
import { ref, reactive, watch, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'

// 导入请求函数
import { userAccountLogin, userMobileLoginMsg, userMobileLogin } from '@/api/login.js'

// 导入模块
import { Form, Field } from 'vee-validate'

// 导入校验数据
import veeSchema from '@/utils/vee-validate-schema'

// 导入消息提示组件
import Message from '@/components/libray/Message.js'




export default {
    name: "LoginFrom",
    components: { Form, Field },
    setup() {
        let store = useStore()
        let router = useRouter()
        let route = useRoute()

        // 控制显示隐藏
        let FromFlage = ref(true)

        // 表单信息对象
        const form = reactive({
            isAgree: false,
            account: null,
            password: null,
            mobile: null,
            code: null
        })

        // 校验规则对象
        // 校验规则对象
        const mySchema = {
            account: veeSchema.account,
            password: veeSchema.password,
            mobile: veeSchema.mobile,
            code: veeSchema.code,
            isAgree: veeSchema.isAgree
        }


        // 获取到的from Dom元素
        const formCom = ref(null)

        // 监听切换的时候 清空表当验证提示 并且清空input中的数据
        watch(FromFlage, () => {
            // 还原数据
            form.isAgree = false
            form.account = null
            form.password = null
            form.mobile = null
            form.code = null
            // 补充校验效果清除，Form组件提供resetForm()
            formCom.value.resetForm()
        })


        // 点击登录按钮的时候
        let submit = async () => {
            // 这个返回是是是否全部校验成功
            let valve = await formCom.value.validate()

            // 先判断校验是否成功
            if (valve) {
                // 异常捕获
                try {
                    // 判断是账户登录
                    if (FromFlage.value) {
                        // 成功那么就数据持久化
                        //01：发送请求获取数据
                        let { result } = await userAccountLogin(form)

                        //02： 数据本地化存储
                        store.commit('user/setUser', { id: result.id, avatar: result.avatar, nickname: result.nickname, account: result.account, mobile: result.mobile, token: result.token })
                        //03：显示提示
                        Message(({ type: 'success', text: '登录成功' }))
                        //04：跳转路由 如果是从其他页面跳进来的那么登录成功后就会跳转到回去
                        router.push(route.query.redirectUrl || '/')

                    } else {
                        // 这里短信登录
                        // 先判断手机号的输入状态 
                        // 状态成功那么就可以验证手机号是否是注册过的或者没有注册
                        // 注册了的话那么就发送验证码 
                        let { result } = await userMobileLogin({ mobile: form.mobile, code: form.code })

                        //02： 数据本地化存储
                        store.commit('user/setUser', { id: result.id, avatar: result.avatar, nickname: result.nickname, account: result.account, mobile: result.mobile, token: result.token })
                        // //03：显示提示
                        Message(({ type: 'success', text: '登录成功' }))
                        // //04：跳转路由 如果是从其他页面跳进来的那么登录成功后就会跳转到回去
                        router.push(route.query.redirectUrl || '/')
                    }


                } catch (e) {
                    console.log(e)
                    Message(({ type: 'error', text: e.response.data.message || "出错了" }))
                }
            }
        }




        let time = ref(0)
        let timerID = null
        // 点击获取验证码
        let send = async () => {
            // 01：监测手机号输入的是否为符合格式  返回值为 Boolean 和 String
            let vide = mySchema.mobile(form.mobile)
            // 02：判断用户输入的值是否为真
            if (typeof vide == "boolean") {
                // 这里做一个错误拦截
                // 不成功的就会捕获并且将捕获的错误显示
                try {

                    // 间歇定时器
                    timerID = setInterval(() => {
                        time.value--
                        // 到0的时候就重置
                        if (time.value <= 0) {
                            clearInterval(timerID);
                            time.value = 0
                        }
                    }, 1000)


                    // 在为0的情况下就说明 用户没有点击发送验证码
                    if (time.value == 0) {
                        time.value = 10;
                        // 发送获取验证码请求
                        let res = await userMobileLoginMsg(form.mobile)
                        // 提示
                        Message({ type: "success", text: "发送成功" })
                    }



                } catch ({ response: { data } }) {
                    // 失败，使用vee的错误函数显示错误信息 setFieldError(字段,错误信息)
                    formCom.value.setFieldError('mobile', data.message)
                }

            } else {
                // 这里是手机号码输入格式不对的情况下
                formCom.value.setFieldError('mobile', vide)
            }





        }

        // 组件移前执行清除定时器
        onBeforeUnmount(() => {
            console.log("清空定时器")
            clearInterval(timerID);
        })




        return { FromFlage, form, mySchema, formCom, submit, send, time }


    }
}





</script>





<style scoped lang="less">
// 账号容器
.account-box {
    .toggle {
        padding: 15px 40px;
        text-align: right;

        a {
            color: @xtxColor;

            i {
                font-size: 14px;
            }
        }
    }

    .form {
        padding: 0 40px;

        &-item {
            margin-bottom: 28px;

            .input {
                position: relative;
                height: 36px;

                >i {
                    width: 34px;
                    height: 34px;
                    background: #cfcdcd;
                    color: #fff;
                    position: absolute;
                    left: 1px;
                    top: 1px;
                    text-align: center;
                    line-height: 34px;
                    font-size: 18px;
                }

                input {
                    padding-left: 44px;
                    border: 1px solid #cfcdcd;
                    height: 36px;
                    line-height: 36px;
                    width: 100%;

                    &.error {
                        border-color: @priceColor;
                    }

                    &.active,
                    &:focus {
                        border-color: @xtxColor;
                    }
                }

                .code {
                    position: absolute;
                    right: 1px;
                    top: 1px;
                    text-align: center;
                    line-height: 34px;
                    font-size: 14px;
                    background: #f5f5f5;
                    color: #666;
                    width: 90px;
                    height: 34px;
                    cursor: pointer;
                }
            }

            >.error {
                position: absolute;
                font-size: 12px;
                line-height: 28px;
                color: @priceColor;

                i {
                    font-size: 14px;
                    margin-right: 2px;
                }
            }
        }

        .agree {
            a {
                color: #069;
            }
        }

        .btn {
            display: block;
            width: 100%;
            height: 40px;
            color: #fff;
            text-align: center;
            line-height: 40px;
            background: @xtxColor;
        }
    }

    .action {
        padding: 20px 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .url {
            a {
                color: #999;
                margin-left: 10px;
            }
        }
    }
}


.disabled {
    pointer-events: none;
    cursor: not-allowed;
    background: #ffaaaa;
}
</style>