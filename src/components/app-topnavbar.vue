<template>
    <nav class="app-topnav">
        <div class="container">
            <ul>
                <template v-if="ShowNavBar">
                    <li><a href="javascript:;"><i class="iconfont icon-user"></i>{{ ShowNavBar.account }}</a></li>
                    <li><a href="javascript:;" @click="outLogin">退出登录</a></li>
                </template>
                <template v-else>
                    <li><router-link to="/login">请先登录</router-link></li>
                    <li><a href="javascript:;">免费注册</a></li>
                </template>

                <li><a href="javascript:;">我的订单</a></li>
                <li><a href="javascript:;">会员中心</a></li>
                <li><a href="javascript:;">帮助中心</a></li>
                <li><a href="javascript:;">关于我们</a></li>
                <li><a href="javascript:;"><i class="iconfont icon-phone"></i>手机版</a></li>
            </ul>
        </div>
    </nav>
</template>
<script>
import { computed } from 'vue';

// 导入路由配置项
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
    setup() {
        let store = useStore()
        let route = useRouter()


        // 设置是否显示登录状态及注册
        let ShowNavBar = computed(() => {
            let { profile } = store.state.user;
            if (profile.token) {
                return profile;
            } else {
                return false;
            }
        })




        // 退出登录需要清空掉vuex中的数据 由于绑定了持久化插件 清空vuex中的数据也会将本地存储的数据清空
        // 跳转到登录页面
        let outLogin = () => {
            // 清空用户的token信息
            store.commit('user/setUser', {})
            // 清空购物车数据
            store.commit('cart/setCartList', [])
            // 跳转到登录页面
            route.push('/login')

        }





        return { ShowNavBar, outLogin }


    },




}
</script>













<style scoped lang="less">
.app-topnav {
    background: #333;

    ul {
        display: flex;
        height: 53px;
        justify-content: flex-end;
        align-items: center;

        li {
            a {
                padding: 0 15px;
                color: #cdcdcd;
                line-height: 1;
                display: inline-block;

                i {
                    font-size: 14px;
                    margin-right: 2px;
                }

                &:hover {
                    color: @xtxColor;
                }
            }

            ~li {
                a {
                    border-left: 2px solid #666;
                }
            }
        }
    }
}
</style>