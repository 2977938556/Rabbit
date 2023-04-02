import Mock from 'mockjs'
import qs from 'qs'

// mock主要是用于模拟数据
// 拦截掉在mock中定义的方法，如果服务端写好了接口便可以注释掉mock中的某些方法
// 主要目的就是保存项目的业务完整度



// mockjs的配置
Mock.setup({
    // 模拟网络延迟 0.5毫秒到1毫秒
    timeout: '500-1000'
})





// // 配置拦截对象及返回数据
// Mock.mock(/\/my\/test/, 'get', () => {
//     return Mock.mock({
//         id: '@id',
//         name: '@ctitle(2,4)',
//         "string|1-10": "★",
//     })
// })



// 拦截我的收藏
Mock.mock(/\/member\/collect/, 'get', config => {
    // 这里是获取查询的参数
    let search = config.url.split('?')[1]
    // 将查询字符串转换成对象
    const queryObject = qs.parse(search)

    let items = []

    for (let i = 0; i < queryObject.pageSize; i++) {
        // 每次循环的时候在item中插入不同的数据
        items.push(Mock.mock({
            id: '@id',
            name: '@ctitle(4,10)',
            desc: '@ctitle(4,10)',
            price: '@float(100,200,2,2)',
            picture: `http://zhoushugang.gitee.io/erabbit-client-pc-static/uploads/clothes_goods_${Mock.mock('@integer(1,8)')}.jpg`

        }))
    }

    // 返回的数据
    return {
        msg: '获取收藏商品成功',
        result: {
            counts: 35,
            pageSize: +queryObject.pageSize,
            page: +queryObject.page,
            items
        }
    }


})