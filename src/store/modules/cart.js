// 购物车状态
export default {
    namespaced: true,
    state() {
        return {
            list: []
        }
    },
    mutations: {
        // 本地：id skuId name picture price nowPrice count attrsText selected stock isEffective
        // 线上：比上面多 isCollect 有用 discount 无用 两项项信息

        //01： 这个是用于添加购物车的数据
        insertCart(state, goods) {
            // 这里是为了查询到是否有同样的产品
            // 返回值为查找到的index索引值
            let sameIndex = state.list.findIndex(item => item.skuId == goods.skuId)

            // 判断是否已经查询到了，查到了那么就表示里面有相同商品
            // 修改新的goods的商品 
            // 把旧的商品通过查询到的索引值给删除掉
            if (sameIndex >= 0) {
                goods.count = state.list[sameIndex].count + goods.count
                state.list.splice(sameIndex, 1)
            }
            // 添加新的商品进入购物车
            state.list.unshift(goods)
        },

        //02：删除产品
        deleteCart(state, goods) {
            let skuIndex = state.list.findIndex(item => item.skuId == goods.skuId)
            if (skuIndex >= 0) {
                state.list.splice(skuIndex, 1)
            }

        }
    },
    actions: {
        //01: 用户储存加入购物车商品
        insertCart(cxt, playload) {
            // 判读用户是否已经登录
            if (cxt.rootState.user.profile.token) {
                // 已经登录

            } else {
                // 没有登录
                // 调用方法传递数据
                cxt.commit("insertCart", playload)
                // 返回成功状态
                return Promise.resolve()
            }

        },
        //02: 删除产品
        deleteCart(cxt, playload) {
            if (cxt.rootState.user.profile.token) {
                // 已经登录
            } else {
                // 没有登录
                cxt.commit("deleteCart", playload)
                // 返回成功状态
                return Promise.resolve()
            }

        }
    },
    getters: {
        // 有效商品列表
        validList(state) {
            return state.list.filter(item => item.stock > 0 && item.isEffective)
        },
        // // 有效商品件数
        validTotal(state, getters) {
            return getters.validList.length
        },
        // // 商品的总价
        validAmount(state, getters) {
            return getters.validList.reduce((p, c) => p + c.price * 100 * c.count, 0) / 100
        },
    }
}


// 写到了删除产品数据
// 明天继续