import request from '@/utils/request.js'


// 这里获取的是分类数据
export const findAllCategory = () => {
    return request('/home/category/head', 'get')
}


// 
export const findTopCategory = (id) => {
    return request('/category', 'get', { id });
}