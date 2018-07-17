import Vue from 'vue'
import Router from 'vue-router'
import Tool from '@/components/Tool'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Tool',
      component: Tool
    }
  ]
})
