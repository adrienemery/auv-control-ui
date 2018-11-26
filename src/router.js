import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Dashboard from './views/Dashboard.vue'
import Debug from './views/Debug.vue'
import Controls from './views/Controls.vue'
import Settings from './views/Settings.vue'

Vue.use(Router)

export default new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      children: [
        {
          path: '/dash',
          name: 'dash',
          component: Dashboard
        },
        {
          path: '/controls',
          name: 'controls',
          component: Controls
        },
        {
          path: '/debug',
          name: 'debug',
          component: Debug
        },
        {
          path: '/settings',
          name: 'settings',
          component: Settings
        },
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
  ]
})
