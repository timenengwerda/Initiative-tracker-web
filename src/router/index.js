import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'tool',
      component: require('@/components/Tool').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
