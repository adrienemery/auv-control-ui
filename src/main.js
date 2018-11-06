import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import lodash from 'lodash'
import VueWamp from 'vue-wamp'
import Buefy from 'buefy'
import 'buefy/lib/buefy.css'

Vue.config.productionTip = false

// use font-awesome icon pack with buefy
Vue.use(Buefy, {defaultIconPack: 'fa'})

console.log(process.env)

// configure vue wamp
Vue.use(VueWamp, {
  debug: true,
  lazy_open: true,
  url: process.env.VUE_APP_WAMP_URL,
  realm: 'realm1',
  authmethods: ['ticket', 'anonymous'],
  authid: 'admin',
  onopen: function(session, details) {
      console.log('WAMP connected', session, details);
      store.commit('SET_WAMP_STATUS', 'Connected')
  },
  onchallenge: function(session, method, details) {
    if (method === 'ticket') {
      return localStorage.getItem('authToken') 
    }
  },
  onclose: function(reason, details) {
      console.log('WAMP closed: ' + reason, details);
      store.commit('SET_WAMP_STATUS', 'Disconnected')
  }
});

// add lodash to the Vue prototype so its accessible globablly
// componentes can access lodash via `this` keyword: "this.$lodash"
Object.defineProperty(Vue.prototype, '$lodash', {value: lodash})

// setup axios to be accessible globally using "this.$http"
Object.defineProperty(Vue.prototype, '$http', {value: axios})

axios.defaults.baseURL = process.env.VUE_APP_API_URL

// Add a request interceptor to add the JWT auth token to the request
axios.interceptors.request.use(function (config) {
  let token = localStorage.getItem('authToken')
  if (token) {
    config['headers'] = {Authorization: 'Token ' + token}
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
    return true
  }
}

// guard all routes against unauthorized users
// and redirect to the login page
router.beforeEach((to, from, next) => {
  if (to.name !== 'login' && isAuthorized() === false) {
    next('/login')
  } else {
    console.log(to)
    next()
  }
})

// setup view instance
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
