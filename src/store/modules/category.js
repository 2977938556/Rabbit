// 导入假数据
import { topCategory } from '@/api/constants.js'
// 导入接口
import { findAllCategory } from '@/api/category.js'









// 分类模块
export default {
    namespaced: true,
    state() {
        return {
            // 由于假数据没有name属性，所以需要添加name属性
            list: topCategory.map(item => {
                return { name: item }
            })
        }
    },

    mutations: {
        // 修改list分类数据
        SETLIST(state, val) {
            state.list = val
        },
        // 鼠标移入显示 【传入id查询】
        SHOWCATE(state, id) {
            let CategoryId = state.list.find(item => item.id == id);
            CategoryId.open = true;
        },
        // 鼠标移入显示 【传入id查询】
        HIDECATE(state, id) {
            let CategoryId = state.list.find(item => item.id == id);
            CategoryId.open = false;
        }
    },

    actions: {
        // 获取list 分类数据
        async getList({ commit }) {
            let data = await findAllCategory();

            // 给每一个分类都添加一个开关open 
            data.result.forEach(item => { item.open = false; })
            commit('SETLIST', data.result)
        }

    }




}