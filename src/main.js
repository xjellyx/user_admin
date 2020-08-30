import Vue from 'vue'
import Qs from 'qs'

import App from './App.vue'
import router from './router'
import store from './store'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css'

import '@/styles/index.scss' // global css

import "./permission"
import './icons' // icon
import './utils/error-log' // error log

import './styles/element-variables.scss'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import * as filters from './filters' // global filters

import {Notification} from "element-ui";

// set ElementUI lang to EN
Vue.use(ElementUI, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  locale:locale })

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false
Vue.prototype.$notify = Notification
Vue.prototype.$qs = Qs
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
