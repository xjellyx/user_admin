import Vue from 'vue'
import VueRouter from 'vue-router'

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
};
Vue.use(VueRouter)

  const baseRouters = [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '../views/login/index')
    },
    {
      path: "/404",
      name: "404",
      hidden: true,
      meta: {
        title: "Be lost*。*",
      },
      component:() => import( '@/views/error/404.vue')
    }, {
      path: "/401",
      name: "401",
      hidden: true,
      meta: {
        title: "Permission denied*。*",
      },
      component:() => import( '@/views/error/401.vue')
    },
    {
      path: "*",
      component:() => import( '@/views/error/404.vue')
    }
]



const createRouter = () => new VueRouter({
  routes: baseRouters
})

export function resetRouter() {
 createRouter()
}

const router = createRouter()

export default router
