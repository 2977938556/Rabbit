<template>
    <div class="xtx-cart-page">
        <div class="container">
            <XtxBread>
                <XtxBreadItem to="/">首页</XtxBreadItem>
                <XtxBreadItem>购物车</XtxBreadItem>
            </XtxBread>
            <div class="cart">
                <table>
                    <thead>
                        <tr>
                            <th width="120">
                                <XtxCheckBox :modelValue="isCheckAll" @update:modelValue="checkAllCart">全选</XtxCheckBox>
                            </th>
                            <th width="400">商品信息</th>
                            <th width="220">单价</th>
                            <th width="180">数量</th>
                            <th width="180">小计</th>
                            <th width="140">操作</th>
                        </tr>
                    </thead>
                    <!-- 有效商品 -->
                    <tbody>
                        <tr v-if="validList.length == 0">
                            <td colspan="6">
                                <CartNone />
                            </td>
                        </tr>
                        <template v-else>
                            <tr v-for="item in validList" :key="item.skuId">
                                <td>
                                    <XtxCheckBox v-model="item.selected" :key="item.skuId">选择</XtxCheckBox>
                                </td>
                                <td>
                                    <div class="goods">
                                        <RouterLink to="/"><img :src="item.picture" alt=""></RouterLink>
                                        <div>
                                            <p class="name ellipsis">{{ item.name }}</p>
                                            <p class="attr">{{ item.attrsText }}</p>
                                        </div>
                                    </div>
                                </td>
                                <td class="tc">
                                    <p>&yen;{{ item.price }}</p>
                                </td>
                                <td class="tc">
                                    <XtxNumbox @update:modelValue="$event => changeCount(item, $event)" :min="1"
                                        :max="item.stock" :modelValue="item.count" />
                                </td>
                                <td class="tc">
                                    <p>&yen;{{ item.nowPrice }}</p>
                                </td>
                                <td class="tc">
                                    <p><a class="green" href="javascript:;" @click="deleteCart(item)">删除</a></p>
                                    <p><a href="javascript:;">找相似</a></p>
                                </td>
                            </tr>
                        </template>
                    </tbody>

                    <!-- 无效商品 -->
                    <tbody>
                        <tr>
                            <td colspan="6">
                                <h3 class="tit">失效商品</h3>
                            </td>
                        </tr>
                        <template v-if="invalidList.length">
                            <tr v-for="item in validList" :key="item.skuId">
                                <td>
                                    <XtxCheckBox v-model="item.selected" :key="item.skuId">选择</XtxCheckBox>
                                </td>
                                <td>
                                    <div class="goods">
                                        <RouterLink to="/"><img :src="item.picture" alt=""></RouterLink>
                                        <div>
                                            <p class="name ellipsis">{{ item.name }}</p>
                                            <p class="attr">{{ item.attrsText }}</p>
                                        </div>
                                    </div>
                                </td>
                                <td class="tc">
                                    <p>&yen;{{ item.price }}</p>
                                </td>
                                <td class="tc">
                                    <XtxNumbox />
                                </td>
                                <td class="tc">
                                    <p>&yen;{{ item.nowPrice }}</p>
                                </td>
                                <td class="tc">
                                    <p><a class="green" href="javascript:;" @click="deleteCart(item)">删除</a></p>
                                    <p><a href="javascript:;">找相似</a></p>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
            <!-- 操作栏 -->
            <div class="action">
                <div class="batch">
                    <XtxCheckBox>全选</XtxCheckBox>
                    <a @click="batchDeleteCart" href="javascript:;">删除商品</a>
                    <a href="javascript:;">移入收藏夹</a>
                    <a @click="batchDeleteCart(true)" href="javascript:;">清空失效商品</a>
                </div>
                <div class="total">
                    共 {{ validList.length }}件商品，已选择 {{ selectedList }} 件，商品合计：
                    <span class="red">￥{{ validAmount }}</span>
                    <XtxButton type="primary">下单结算</XtxButton>
                </div>
            </div>
            <!-- 猜你喜欢 -->
            <GoodRelevant />
        </div>
    </div>
</template>
<script>
import { useStore } from 'vuex'
import { computed } from 'vue'

// 猜你喜欢组件
import GoodRelevant from '@/view/goods/components/goods-relevant.vue'

import XtxNumbox from '@/components/libray/xtx-numbox.vue'
// 没有数据就进来这里
import CartNone from './component/cat-none.vue'
// 提示组件
import Message from '@/components/libray/Message'
// 确认组件
import Confirm from '@/components/libray/XtxConfirm.js'

export default {
    name: 'Cart',
    components: { GoodRelevant, CartNone, XtxNumbox },

    setup() {
        let store = useStore()

        // 返回有效商品
        let validList = computed(() => {
            return store.getters['cart/validList']
        })
        // 返回无效的商品
        let invalidList = computed(() => {
            return store.getters['cart/invalidList']
        })
        // 返回选中的铲平数量
        let selectedList = computed(() => {
            return store.getters['cart/selectedList'].length
        })
        // 返回是否全选
        let isCheckAll = computed(() => {
            return store.getters['cart/isCheckAll']
        })
        // 选中的总金额
        let validAmount = computed(() => {
            return store.getters['cart/validAmount']
        })



        // 全选功能
        let checkAllCart = (selected) => {
            store.dispatch('cart/checkAllCart', selected)
        }

        // 删除单个产品
        let deleteCart = (item) => {
            Confirm({ title: "删除提示", text: "确定要删除吗" }).then(() => {
                store.dispatch('cart/deleteCart', item).then(value => {
                    Message({ type: "success", text: "删除成功" })
                })
            }).catch(e => {

            })
        }

        // 删除选中的产品
        let batchDeleteCart = (iscode) => {
            Confirm({ title: "删除产品", text: `亲，是否要${iscode == true ? '清空失效的' : "删除"}全部选中的产品` }).then(() => {
                store.dispatch('cart/batchDeleteCart', iscode).then(() => {
                    Message({ title: "提示", text: `${iscode == true ? '清空成功' : '删除成功'}`, type: "success" })
                })
            }).catch(() => { })

        }

        // 数量
        let changeCount = (goods, count) => {
            store.dispatch('cart/updateCartCount', { goods, count })
        }




        return { validList, invalidList, selectedList, isCheckAll, validAmount, checkAllCart, deleteCart, batchDeleteCart, changeCount }
    },
}
</script>
<style scoped lang="less">
.tc {
    text-align: center;

    .xtx-numbox {
        margin: 0 auto;
        width: 120px;
    }
}

.red {
    color: @priceColor;
}

.green {
    color: @xtxColor
}

.f16 {
    font-size: 16px;
}

.goods {
    display: flex;
    align-items: center;

    img {
        width: 100px;
        height: 100px;
    }

    >div {
        width: 280px;
        font-size: 16px;
        padding-left: 10px;

        .attr {
            font-size: 14px;
            color: #999;
        }
    }
}

.action {
    display: flex;
    background: #fff;
    margin-top: 20px;
    height: 80px;
    align-items: center;
    font-size: 16px;
    justify-content: space-between;
    padding: 0 30px;

    .xtx-checkbox {
        color: #999;
    }

    .batch {
        a {
            margin-left: 20px;
        }
    }

    .red {
        font-size: 18px;
        margin-right: 20px;
        font-weight: bold;
    }
}

.tit {
    color: #666;
    font-size: 16px;
    font-weight: normal;
    line-height: 50px;
}

.xtx-cart-page {
    .cart {
        background: #fff;
        color: #666;

        table {
            border-spacing: 0;
            border-collapse: collapse;
            line-height: 24px;

            th,
            td {
                padding: 10px;
                border-bottom: 1px solid #f5f5f5;

                &:first-child {
                    text-align: left;
                    padding-left: 30px;
                    color: #999;
                }
            }

            th {
                font-size: 16px;
                font-weight: normal;
                line-height: 50px;
            }
        }
    }
}
</style>