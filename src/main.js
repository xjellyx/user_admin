import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import "./permission"
import './icons' // icon
import './styles/element-variables.scss'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import Cookies from 'js-cookie'
import {Notification} from "element-ui";

// set ElementUI lang to EN
Vue.use(ElementUI, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  locale:locale })
Vue.config.productionTip = false
Vue.prototype.$notify = Notification
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
