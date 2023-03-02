import request from "@/utils/request.js"


// 获取品牌的数据
export const findBrand = ((limit = 6) => {
    return request('/home/brand', 'get', { limit })
})




// 获取广告图片的数据
export const findBranner = () => {
    return request('/home/banner', 'get');
}




// 获取新鲜好物数据
export const findNew = () => {
    return request('/home/new', 'get');
}




// 人气推荐
export const findHot = () => {
    return request('/home/hot', 'get');
}

