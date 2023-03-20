// 用户模块
export default {
    namespaced: true,
    state() {
        return {
            // 这个是用户的信息
            profile: {
                id: '',
                avatar: '',
                nickname: '',
                account: '',
                mobile: '',
                token: '',
            },
            // 这个是回跳的地址
            redirectUrl: "/"
        }
    },
    mutations: {
        setUser(state, plyload) {
            state.profile = plyload
        },
        setRedirectUrl(state, plyload) {
            state.redirectUrl = plyload
        }
    }
}