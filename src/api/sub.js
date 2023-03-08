import request from '@/utils/request.js';



// 筛选数据的查询
export const findSubCategoryFilter = (id) => {
    return request('/category/sub/filter', 'get', { id })
}



// 无限加载的查询
export const findSubCategoryGoods = (params) => {
    return request('/category/goods/temporary', 'post', params)
}