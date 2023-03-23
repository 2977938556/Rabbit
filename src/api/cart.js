import request from '@/utils/request.js'


/**
 * 获取新的商品信息
 * @param {String} skuId - 商品SKUID
 * @returns Promise
 */
export const getNewCartGoods = (skuId) => {
    return request(`/goods/stock/${skuId}`, 'get')
}