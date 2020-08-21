import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

  const routes = [
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '../views/login/index')
    },
]

const router = new VueRouter({
  mode: 'history',
 //  base: process.env.BASE_URL,
  scrollBehavior: () => ({
    y: 0,
  }),
  routes
})

// reset router
export function resetRouter() {
  router.matcher = new VueRouter({
    mode: 'history',
    //  base: process.env.BASE_URL,
    scrollBehavior: () => ({
      y: 0,
    }),
    routes
  }).matcher
}

export default router
