import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/login/Login'
import Checkout from '@/components/checkout/Checkout'
import Enter from '@/components/enter/Enter'
import Received from '@/components/received/Received'
import Platform from '@/components/platform/Platform'
import Detail from '@/components/platform/Detail'

Vue.use(Router)

export default new Router({
  // linkActiveClass:'active',
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },{
      path: '/index',
      name: 'Received',
      component: Received
    },{
      path: '/index/checkout',
      name: 'Checkout',
      component: Checkout
    }, {
      path: '/index/enter',
      name: 'Enter',
      component: Enter
    },{
      path: '/index/received',
      name: 'Received',
      component: Received
    },{
      path: '/index/platform',
      name: 'Platform',
      component: Platform
    },{
      path: '/index/platform/detail',
      name: 'Detail',
      component: Detail
    },


  ]
})
