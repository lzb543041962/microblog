// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// import './assets/css/bootstrap.min.css'
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
  // Vue.prototype.URL_PREFIX = 'http://61.164.247.237:9999'
  Vue.prototype.URL_PREFIX = 'http://10.8.151.43:7777'
} else {
  Vue.prototype.URL_PREFIX = 'http://10.8.151.43:7777'
  // Vue.prototype.URL_PREFIX = 'http://10.8.105.26:8080'
  // Vue.prototype.URL_PREFIX = 'http://10.8.105.29:8080'
  // Vue.prototype.URL_PREFIX = 'http://localhost:8080'
  // Vue.prototype.URL_PREFIX = 'http://10.8.144.249:8080'
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
