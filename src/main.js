import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueSwal from 'vue-sweetalert2'
import VModal from 'vue-js-modal'

Vue.use(VModal)
Vue.use(VueSwal)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')

