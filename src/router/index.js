import Vue from 'vue'
import VueRouter from 'vue-router'

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
        title: "迷路了*。*",
      },
      component:() => import( '@/views/error/index.vue')
    },
    {
      path: "*",
      component:() => import( '@/views/error/index.vue')
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
