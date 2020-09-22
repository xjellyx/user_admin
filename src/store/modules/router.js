import {delMenu, editMenu, getMenuList, setMenuList} from "../../api/menu";
import {getProjectSettings} from "../../api/config";
import {asyncRouterHandle} from '@/utils/asyncRouter';

const routerList = []
const formatRouter = (routes) => {
    routes && routes.map(item => {
        if ((!item.children || item.children.every(ch => ch.hidden)) &&
            (item.name !== '404' ||  item.name !== '401')) {
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
    if (data.length!==0){
        const asyncRouter = data
        formatRouter(asyncRouter)
        baseRouter[0].children = asyncRouter
        }else {
        const asyncRouter = [
            {
                path: '/layout/dashboard',
                name: 'dashboard',
                component: "dashboard/index.vue",
                meta: {
                    title: "Dashboard",
                    icon: "dashboard",
                },
            },
            {
                path: '/layout/permission',
                name: 'permission',
                component: "permission/index.vue",
                meta: {
                    title: "Permission",
                    icon: "permission",
                },
                children: [
                    {
                        path: '/layout/permission/role/index',
                        name: 'role',
                        component: "permission/role/index.vue",
                        meta: {
                            title: "Role",
                            icon: "role",
                        }
                    },
                    {
                        path: '/layout/permission/user/index',
                        name: 'user',
                        component: "permission/user/index.vue",
                        meta: {
                            title: "User",
                            icon: "user",
                        }
                    },
                    {
                        path: '/layout/permission/api/index',
                        name: 'api',
                        component: "permission/api/index.vue",
                        meta: {
                            title: "API",
                            icon: "api",
                        }
                    },
                    {
                        path: '/layout/permission/menu/index',
                        name: 'menu',
                        component: "permission/menu/index.vue",
                        meta: {
                            title: "Menu",
                            icon: "menu",
                        }
                    }
                ]
            },
            {
                path: '/layout/tool/index',
                name: 'tool',
                component: "tool/index.vue",
                meta: {
                    title: "Tool",
                    icon: "tool",
                }
            },
            {
                path: '/layout/about/index',
                name: 'about',
                component: "about/index.vue",
                meta: {
                    title: "About",
                    icon: "about",
                }
            },
            {
                path: '/layout/profile/index',
                name: 'profile',
                component: "profile/index.vue",
                hidden: true,
                meta: {
                    title: "Profile",
                    icon: "profile",
                }
            },
        ]
        formatRouter(asyncRouter)
        baseRouter[0].children = asyncRouter
    }
    // 主題更改
    // baseRouter[0].children.push({    path: '/layout/theme',
    //     name: 'theme',
    //     component: "theme/index.vue",
    //     meta: {
    //         title: "Theme",
    //         icon:"theme",
    //     },})
    asyncRouterHandle(baseRouter)
    // console.log("aaaaaaaaaaaaaaaa",baseRouter)
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
