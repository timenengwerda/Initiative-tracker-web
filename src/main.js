import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueSwal from 'vue-sweetalert2'
import VModal from 'vue-js-modal'
import firebase from 'firebase/app'

const config = {
  apiKey: "AIzaSyCMNRLROBqschA8VftixS-iQVkhTSKFMKo",
  authDomain: "initiative-tracker-4b29d.firebaseapp.com",
  databaseURL: "https://initiative-tracker-4b29d.firebaseio.com",
  projectId: "initiative-tracker-4b29d",
  storageBucket: "initiative-tracker-4b29d.appspot.com",
  messagingSenderId: "689302482447"
}

firebase.initializeApp(config)

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

