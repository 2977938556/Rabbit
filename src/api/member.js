import request from "@/utils/request.js"





// 或者个人收藏
export const findCollect = ({ page = 1, pageSize = 10, collectType = 1 }) => {
    return request('/member/collect', 'get', { page, pageSize, collectType })
}