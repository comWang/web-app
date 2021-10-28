import Vue from 'vue'
import VueRouter from 'vue-router'
import elementUi from 'element-ui'
import '@/assets/theme/index.css'
import App from './App.vue'
import Icon from '@/components/Icon'
import router from './router'
import store from './store'
import './vue.directives'
import './mock'
import './permission'

const webpackContextModule = require.context('./assets/icons', true, /\.svg$/)

webpackContextModule.keys().forEach(webpackContextModule)
Vue.config.productionTip = false
Vue.component('Icon', Icon)
Vue.use(elementUi)
Vue.use(VueRouter)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
