import router from "./router";
import store from "./store";
import VabProgress from "nprogress";

const routesWhiteList= ["/login", "/register", "/404", "/401"]
const recordRoute = true
const progressBar = true
// router each moving
router.beforeEach(async (to, from, next) =>{
    if (progressBar) VabProgress.start()
    let hasToken = store.getters['user/token']
    if (hasToken){
        if (to.path === "/login"){
            next("/")
        }else {
            // TODO moving touter
        }
    }else {
        //
        if (routesWhiteList.indexOf(to.path)!==-1){
            next()
        }else {
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