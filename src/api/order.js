import request from '@/utils/request.js'

/**
 * 获取结算信息
 */
export const findCheckoutInfo = () => {
  return request('/member/order/pre', 'get')
}


/**
   *添加地址
*/
export const addAddress = (address) => {
  return request('/member/address', 'post', address)
}




/**
 * 编辑收货地址信息
 * @param {Object} address - 地址对象
 */
export const editAddress = (address) => {
  return request(`/member/address/${address.id}`, 'put', address)
}



/**
 * 提交订单
 * @param {Object} order - 订单信息对象
 */
export const createOrder = (order) => {
  return request('/member/order', 'post', order)
}