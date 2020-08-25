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
]



const createRouter = () => new VueRouter({
  routes: baseRouters
})

const router = createRouter()

export default router
