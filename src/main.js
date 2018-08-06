import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import lodash from 'lodash'
import Buefy from 'buefy'
import 'buefy/lib/buefy.css'


Vue.config.productionTip = false

// use fontawseom icond pack with buefy
Vue.use(Buefy, {defaultIconPack: 'fa'})

// add lodash to the Vue prototype so its accessible globablly
// componentes can access lodash via `this` keyword: "this.$lodash"
Object.defineProperty(Vue.prototype, '$lodash', {value: lodash})

// setup axios to be accessible globally using "this.$http"
Object.defineProperty(Vue.prototype, '$http', {value: axios})

// TODO setup a enviornment variable to manage the base url
axios.defaults.baseURL = 'http://127.0.0.1:8000/'

// Add a request interceptor to add the JWT auth token to the request
axios.interceptors.request.use(function (config) {
  let token = localStorage.getItem('authToken')
  if (token) {
    config['headers'] = {Authorization: 'JWT ' + token}
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// handle 401 response errors globally for all axios request
axios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  if (error.response.status === 401) {
    // remove the JWT from local storage since it has expired
    localStorage.removeItem('authToken')
    // redirect back to login page
    router.push('login')
  } else {
    return Promise.reject(error)
  }
})

// TODO update to check if jwt is in local storage
function isAuthorized () {
  if (localStorage.getItem('authToken')) {
    return true
  } else {
    return true // TODO set to false when auth flow implimented
  }
}

// gaurd all routes against unauthorized users
// and redirect to the login page
router.beforeEach((to, from, next) => {
  if (to.name !== 'login' && isAuthorized() === false) {
    next('/login')
  } else {
    console.log(to)
    next()
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
