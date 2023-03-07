import request from '@/utils/request.js';




export const findSubCategoryFilter = (id) => {
    return request('/category/sub/filter', 'get', { id })
}