// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import axios from 'axios'
import 'jquery'

Vue.use(ElementUI)

Vue.config.productionTip = false

Vue.prototype.$ajax = axios

// 请求地址前缀设置为全局变量URL_PREFIX
if (process.env.NODE_ENV !== 'development') {
  Vue.prototype.URL_PREFIX = 'http://10.8.151.43:7777'
} else {
  Vue.prototype.URL_PREFIX = 'http://localhost:8080'
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
