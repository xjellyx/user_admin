import {setMenuList,getMenuList} from "../../api/menu";
import { asyncRouterHandle } from '@/utils/asyncRouter';
import Vue from "vue";

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

const actions  ={
    async setAsyncRouter({commit}) {
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
        const asyncRouter = data
        formatRouter(asyncRouter)
        baseRouter[0].children = asyncRouter
        asyncRouterHandle(baseRouter)
        commit('setAsyncRouter', baseRouter)
        commit('setRouterList', routerList)
        commit('setMenuList',data)

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
