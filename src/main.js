// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import axios from 'axios'
import VueInputCode from 'vue-input-code'
Vue.component('VueInputCode', VueInputCode)
import 'jquery'

Vue.use(ElementUI)

Vue.config.productionTip = false

Vue.prototype.$ajax = axios

if (process.env.NODE_ENV !== 'development') {
  Vue.prototype.URL_PREFIX = 'http://10.8.151.43:7777'
} else {
  Vue.prototype.URL_PREFIX = 'http://10.8.151.43:7777'
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
