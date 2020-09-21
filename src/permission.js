import router from "./router";
import store from "./store";
import {getProjectSettings} from "./api/config";


let asyncRouterFlag = 0
const whiteList = ['login', 'register','404','401']
// router each moving
router.beforeEach(async(to, from, next) => {
    const token = store.getters['user/token']
    // 在白名单中的判断情况
    if (whiteList.indexOf(to.name) > -1) {
        if (token) {
            next({ path: '/layout/dashboard' })
        } else {
            next()
        }
    } else {
        // 不在白名单中并且已经登陆的时候
        if (token) {
            // 添加flag防止多次获取动态路由和栈溢出
            if (!asyncRouterFlag) {
                asyncRouterFlag++
                await store.dispatch('router/setAsyncRouter')
                await store.dispatch("user/getUserInfo")
                // 获取系统配置信息
                await store.dispatch("settings/getSettings")
                const asyncRouters = store.getters['router/asyncRouters']
                router.addRoutes(asyncRouters)
                next({...to, replace: true })
            } else {
                next()
            }
        }
        // 不在白名单中并且未登陆的时候
        if (!token) {
            next({
                path:"/login",
            })
        }
    }
})
