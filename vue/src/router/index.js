import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/login/login.vue'
import Home from '@/components/home/home.vue'
import User from '@/components/right/users.vue'
import Roles from '@/components/right/roles.vue'
import Rights from '@/components/right/rights.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/home',
      component: Home,
      children: [
        { path: '/users', component: User },
        { path: '/roles', component: Roles},
        { path: '/rights', component: Rights},

      ]
    }
  ]
})
