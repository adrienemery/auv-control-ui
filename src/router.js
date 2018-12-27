import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Dashboard from './views/Dashboard.vue'
import Debug from './views/Debug.vue'
import Controls from './views/Controls.vue'
import Settings from './views/Settings.vue'
import Team from './views/Team.vue'
import Security from './views/Security.vue'
import ForgotPassword from './components/ForgotPassword.vue'
import LoginComponent from './components/LoginComponent.vue'

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
        {
          path: '/team',
          name: 'team',
          component: Team
        },
        {
          path: '/security',
          name: 'security',
          component: Security
        }
      ]
    },
    {
      path: '/',
      component: Login,
      children: [
        {
          path: 'login',
          name: 'login',
          component: LoginComponent
        },
        {
          path: 'forgot-password',
          name: 'forgotPassword',
          component: ForgotPassword
        },
      ]
    },
  ]
})
