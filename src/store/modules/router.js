import {setMenuList,getMenuList,delMenu,editMenu} from "../../api/menu";
import { asyncRouterHandle } from '@/utils/asyncRouter';
import Vue from "vue";
import da from "element-ui/src/locale/lang/da";

const routerList = []
const formatRouter = (routes) => {
    routes && routes.map(item => {
        if ((!item.children || item.children.every(ch => ch.hidden)) && item.name !== '404') {
            routerList.push({ label: item.meta.title, value: item.name })
        }
        item.meta.hidden = item.hidden
        if (item.children && item.children.length > 0) {
            formatRouter(item.children)
        }
    }
    )

}

const  state = {
    routerList: [],
    asyncRouters: [],
    menuList: []
}

const getters = {
        // 获取动态路由
        asyncRouters(state) {
            return state.asyncRouters
        },
        routerList(state) {
            return state.routerList
        },
        menuList(state) {
            return state.menuList
        }
}

const mutations = {
    setRouterList(state, routerList) {
        state.routerList = routerList
    },
    // 设置动态路由
    setAsyncRouter(state, asyncRouters) {
        state.asyncRouters = asyncRouters
    },
    setMenuList(state,list) {
      state.menuList= list
    }
}

async function reload(commit) {
    const baseRouter = [{
        path: '/layout',
        name: 'layout',
        component: "layout/index.vue",
        meta: {
            title: "Layout",
            icon:"layout",
        },
        children: []
    }]
    const {data}  = await getMenuList()
    commit('setMenuList',JSON.parse(JSON.stringify(data)))
    const asyncRouter = data
    formatRouter(asyncRouter)
    baseRouter[0].children = asyncRouter
    asyncRouterHandle(baseRouter)
    commit('setAsyncRouter', baseRouter)
    commit('setRouterList', routerList)
}

const actions  ={
    async setAsyncRouter({commit}) {
        await reload(commit)
        return true
    },
    async addMenu({commit,state},form) {
      await setMenuList([form])
       // 重置路由
        await reload(commit)
        return true
    },
    // 删除数据，改变数据状态
    async deleteMenu({commit,state},id){
        await delMenu(id)
        await reload(commit)
        return true
    },
    async changeMenu({commit,state},form) {
        await  editMenu(form)
        await reload(commit)
        return true
    }


}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}
