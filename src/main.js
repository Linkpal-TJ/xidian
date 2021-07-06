// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import elementUI from 'element-ui'

// AFTableColumn是element-ui table表格列宽自动适应组件
import AFTableColumn from 'af-table-column'

import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/basic.css'
import global from '@/assets/js/global.js'

Vue.prototype.GLOBAL = global

Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.use(elementUI)

const fontRate = {
  CHAR_RATE: 1.1, // 汉字比率
  NUM_RATE: 0.65, // 数字
  OTHER_RATE: 0.8 // 除汉字和数字以外的字符的比率
}
const fontSize = 17

// Vue.use(Plugin)
Vue.use(AFTableColumn,{ fontRate, fontSize })






/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
