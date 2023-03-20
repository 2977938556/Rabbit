import request from "@/utils/request"


/**
 * 第三方登录
 * @param {String} unionId - 第三方登录唯一标识
 * @param {Integer} source - 来源 1为pc，2为webapp，3为微信小程序，4为Android，5为ios,6为qq,7为微信
 * @returns Promise
 */

// 获取openId 传递给服务器查询判断是否被绑定
export const userQQLogin = (unionId, source = 1) => {
    return request('/login/social', 'post', { unionId, source })
}




/**
 * 获取QQ绑定的时候短信验证码
 * @param {String} mobile - 手机号
 * @returns promise
 */
export const userQQBindCode = (mobile) => {
    return request('/login/social/code', 'get', { mobile })
}




/**
 * QQ登录-绑定帐号
 * @param {String} unionId - QQ唯一标识，openId
 * @param {String} mobile - 手机号
 * @param {String} code - 验证码
 * @returns
 */
export const userQQBindLogin = ({ unionId, mobile, code }) => {
    return request('/login/social/bind', 'post', { unionId, mobile, code })
}




/**
 * 校验帐号是否存在
 * @param {String} account - 帐号
 * @returns Promise
 */
export const userCheckAccount = (account) => {
    return request('/register/check', 'get', { account })
}




/**
 * @param {string} unionId qqid
 * @param {string} mobile 手机号
 * @param {string} unionId qqid
 * 
 */
export const userQQbindLogin = ({ unionId, mobile, code, account, password }) => {
    return request('/login/social/bind', 'post', { unionId, mobile, code, account, password })
}

