import request from "@/utils/request.js";


// 获取商品数据
export const findGoods = (id) => {
    return request('/goods', 'get', { id })
}


// 获取猜你喜欢数据
export const findRelGoods = (id, limit = 16) => {
    return request('/goods/relevant', 'get', { id, limit })
}


/**
 * 获取热榜商品
 * @param {string} id -商品的id
 * @param {Number} type - 1代表24小时热销榜 2代表周热销榜 3代表总热销榜
 * @param {Number} limit - 获取个数
 */
export const findHotGoods = ({ id, type, limit = 3 }) => {
    return request('/goods/hot', 'get', { id, type, limit })
}