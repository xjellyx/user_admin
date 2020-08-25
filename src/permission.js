import router from "./router";
import store from "./store";
import VabProgress from "nprogress";

const routesWhiteList= ["/login", "/register", "/404", "/401"]
const recordRoute = true
const progressBar = true
let asyncRouterFlag = 0
const whiteList = ['login', 'register','404']
// router each moving
router.beforeEach(async (to, from, next) =>{
    if (progressBar) VabProgress.start()
    let hasToken = store.getters['user/token']
    // 在白名单中的判断情况
    if (whiteList.indexOf(to.name) > -1) {
        if (hasToken) {
            next({ path: '/' })
        } else {
            next()
        }
    }else {
        if (hasToken){
                if (!asyncRouterFlag){
                    asyncRouterFlag ++
                    await store.dispatch("router/setAsyncRouter")
                    const asyncRouters = store.getters['router/asyncRouters']
                    router.addRoutes(asyncRouters)
                    next({...to, replace: true })
                }
            }else {
            // 不在白名单中并且未登陆的时候
                if (recordRoute){
                    next(`/login?redirect=${to.path}`)
                } else {
                    next('/login')
                }

                if (progressBar) VabProgress.done();
            }
        }

})


router.afterEach(() =>{

})