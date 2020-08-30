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
        commit('setMenuList',JSON.parse(JSON.stringify(data)))
        const asyncRouter = data
        formatRouter(asyncRouter)
        baseRouter[0].children = asyncRouter
        asyncRouterHandle(baseRouter)
        commit('setAsyncRouter', baseRouter)
        commit('setRouterList', routerList)

        return true
    },
    async addMenu({commit,state},form) {
        const {data} =  await setMenuList([form])
       // 重置路由
        state.menuList.push(JSON.parse(JSON.stringify(data[0])))
        const asyncRouter = data
        formatRouter(asyncRouter)
        state.asyncRouters[0].children.push(asyncRouter[0])
        return true
    },
    // 删除数据，改变数据状态
    async deleteMenu({commit,state},id){
        await delMenu(id)
        state.menuList.forEach((item )=>{
            if (item.id === id ){
                state.menuList.splice(item,1)
            }
        })
        state.asyncRouters[0].children.forEach((item) =>{
            if (item.id === id ){
                state.asyncRouters[0].children.splice(item,1)
            }
        })
        return true
    },
    async changeMenu({commit,state},form) {
       const {data} = await  editMenu(form)
        state.menuList.forEach((item )=>{
            if (item.id === data.id ){
                state.menuList.splice(item,1)
                state.menuList.push(JSON.parse(JSON.stringify(data[0])))
            }
        })
        state.asyncRouters[0].children.forEach((item) =>{
            if (item.id === id ){
                state.asyncRouters.splice(item,1)
                const asyncRouter = data
                formatRouter(asyncRouter)
                state.asyncRouters[0].children.push(asyncRouter[0])
            }
        })
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
