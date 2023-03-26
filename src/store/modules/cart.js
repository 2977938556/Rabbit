// 导入更新购物车数据模块
import { getNewCartGoods, mergeLocalCart, findCartList, insertCart, deleteCart, updateCart, checkAllCart } from '@/api/cart.js'


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

        },
        //03：更新修改购物车的数据
        updateCart(state, goods) {
            // 01：首先需要判断是否有skuid的数据如果有那么就可以找到数据并进行修改
            let goodsIndex = state.list.find(item => item.skuId == goods.skuId)
            if (goodsIndex) {
                // 遍历goods的数据看看传递的数据是否为空的
                for (let key in goods) {
                    // 这里是判断传递的数据是否有为空的不合法
                    if (goods[key] != undefined && goods[key] != null && goods[key] !== '') {
                        // 修改数据
                        goodsIndex[key] = goods[key]
                    }
                }

            }
        },
        //04： 设置购物车列表
        setCartList(state, playload) {
            // 设置购物车数据 【只做两个操作 清空与添加】
            state.list = playload
        }

    },
    actions: {
        //01: 用户储存加入购物车商品
        insertCart(ctx, playload) {
            return new Promise((resolve, reject) => {
                // 判读用户是否已经登录
                if (ctx.rootState.user.profile.token) {
                    // 已经登录 添加到服务器中的购物车
                    insertCart(playload).then(() => {
                        return findCartList()
                    }).then(({ result }) => {
                        ctx.commit('setCartList', result)
                        resolve()
                    })


                } else {
                    // 没有登录
                    // 调用方法传递数据
                    ctx.commit("insertCart", playload)
                    // 返回成功状态
                    resolve()
                }

            })

        },
        //02: 删除产品
        deleteCart(ctx, playload) {
            return new Promise((resolve, reject) => {
                if (ctx.rootState.user.profile.token) {
                    // 已经登录 的情况下删除掉
                    deleteCart([playload.skuId]).then(() => {
                        return findCartList()
                    }).then(({ result }) => {
                        ctx.commit('setCartList', result)
                        resolve()
                    })


                } else {
                    // 没有登录
                    ctx.commit("deleteCart", playload)
                    // 返回成功状态
                    resolve()
                }
            })

        },
        //03：系统初始化修改购物车商品
        updateCart(ctx) {
            return new Promise((resolve, reject) => {
                // 判断是否登录了
                if (ctx.rootState.user.profile.token) {
                    //  登录了
                    findCartList().then(({ result }) => {
                        ctx.commit('setCartList', result)
                        resolve()
                    })
                } else {
                    // 没有登录
                    // 遍历本地的数据拿去与服务器进行更新
                    let promiseAllList = ctx.state.list.map(item => {
                        return getNewCartGoods(item.skuId)
                    })
                    // promiseAllList 返回值为一个待定的promis数组
                    Promise.all(promiseAllList).then((dataList) => {
                        // 遍历数据调用mutations的方法
                        dataList.forEach((data, i) => {
                            // 由于遍历的数据和我们本地的数据顺序是一致所以呢可以直接使用索引值的方式
                            // 第二个值就是结构出返回的数据 展开的意思
                            ctx.commit('updateCart', { skuId: ctx.state.list[i].skuId, ...data.result })
                        });
                        // 返回成功的状态 
                        resolve()
                    })
                }
            })

        },
        //04: 全选
        checkAllCart(ctx, selected) {
            return new Promise((resolve, reject) => {
                if (ctx.rootState.user.profile.token) {
                    // 获取有效的id集合
                    let skuidList = ctx.getters.validList.map(item => item.skuId)

                    checkAllCart({ selected, ids: skuidList }).then(res => {
                        return findCartList()
                    }).then(({ result }) => {
                        ctx.commit('setCartList', result)
                        resolve()
                    })

                } else {
                    ctx.getters.validList.forEach(item => {
                        ctx.commit('updateCart', { skuId: item.skuId, selected: selected })
                    })
                    resolve()
                }
            })
        },
        //05: 批量删除
        batchDeleteCart(ctx, iscode) {
            return new Promise((resolve, reject) => {
                if (ctx.rootState.user.profile.token) {
                    //已登录
                    let skuids = ctx.getters[iscode == true ? 'invalidList' : 'selectedList'].map(item => item.skuId)
                    if (!skuids.length) {
                        return reject(`${iscode == true ? '没有需要清空的产品' : '没有需要删除的产品'}`)
                    } else {
                        deleteCart(skuids).then(() => {
                            findCartList()
                        }).then(({ result }) => {
                            ctx.commit('setCartList', result)
                            resolve()
                        })
                    }

                } else {
                    //未登录
                    // 这里判断是否删除还是清空失效列表
                    ctx.getters[iscode == true ? 'invalidList' : 'selectedList'].forEach(item => {
                        ctx.commit('deleteCart', item)
                    })
                    resolve()
                }
            })
        },
        //06：修改购物车的数量
        updateCartCount(ctx, { goods, count }) {
            return new Promise((resolve, reject) => {
                if (ctx.rootState.user.profile.token) {
                    // 登录的情况下
                    updateCart({ ...goods, count }).then(res => {
                        console.log(res)
                        return findCartList()
                    }).then(({ result }) => {
                        ctx.commit('setCartList', result)
                        resolve()
                    })


                } else {
                    // 修改数据
                    ctx.commit('updateCart', { skuId: goods.skuId, count: count })
                    resolve()
                }
            })
        },
        //07： 修改规格参数
        updateCartSku(ctx, { oldSkuId, newSku }) {
            return new Promise((resolve, reject) => {
                if (ctx.rootState.user.profile.token) {
                    // 登录了修改规格参数


                } else {
                    // 修改数据
                    // 01:获取旧的商品数据
                    let oldSkuIdList = ctx.state.list.find(item => item.skuId == oldSkuId.skuId)
                    // 02:删除获取的商品数据
                    ctx.commit('deleteCart', oldSkuId)
                    // 03：合并新的商品数据
                    let { skuId, inventory: stock, oldPrice: nowPrice, price, valueName: attrsText } = newSku
                    // 插入
                    let newCartSku = { ...oldSkuId, skuId, stock, nowPrice, price, attrsText }
                    ctx.commit('insertCart', newCartSku)

                    resolve()
                }
            })
        },
        // 合并本地购物车
        async mergeLocalCart(ctx) {
            // 存储token后调用合并API接口函数进行购物合并
            let cartList = ctx.state.list.map(item => {
                // 由于调用接口需要这些参数所以需要返回一个【{}】
                return {
                    skuId: item.skuId,
                    selected: item.selected,
                    count: item.count
                }
            })

            // 合并购物车
            await mergeLocalCart(cartList)
            // 方法走到这里表示成功合并了

            // 清空购物车
            ctx.commit('setCartList', [])
        }

    },
    getters: {
        // 有效商品列表
        validList(state) {
            return state.list.filter(item => item.stock > 0 && item.isEffective)
        },
        //  有效商品件数
        validTotal(state, getters) {
            return getters.validList.length
        },
        // 无效商品列表
        invalidList(state) {
            return state.list.filter(item => item.stock < 0 && item.isEffective == false)
        },
        // 选中的商品
        selectedList(state, getters) {
            return getters.validList.filter(item => item.selected) || []
        },
        // // 选中的商品列表的数量
        selectedTotal(state, getters) {
            return getters.selectedList.reduce((p, c) => p + c.count, 0)
        },
        // // 商品的总价
        validAmount(state, getters) {
            return parseFloat(getters.selectedList.reduce((p, c) => p + c.price * 100 * c.count, 0) / 100).toFixed(1) + 0;
        },
        // // 是否全选
        isCheckAll(state, getters) {
            // 这里是判断是否还有数据
            if (getters.validList.length === 0) {
                return false
            }
            return getters.validList.every(item => item.selected == true)
        },




    }
}

// 还剩下二个模块 加油