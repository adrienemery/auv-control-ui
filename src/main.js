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
  lazy_open: false,
  url: process.env.VUE_APP_WAMP_URL,
  realm: 'realm1',
  onopen: function(session, details) {
      console.log('WAMP connected', session, details);
      store.commit('SET_AUV_STATUS', 'Connected')
  },
  onclose: function(reason, details) {
      console.log('WAMP closed: ' + reason, details);
      store.commit('SET_AUV_STATUS', 'Disconnected')
  }
});

// add lodash to the Vue prototype so its accessible globablly
// componentes can access lodash via `this` keyword: "this.$lodash"
Object.defineProperty(Vue.prototype, '$lodash', {value: lodash})

// setup axios to be accessible globally using "this.$http"
Object.defineProperty(Vue.prototype, '$http', {value: axios})

// TODO setup a enviornment variable to manage the base url
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

// setup view instance
new Vue({
  router,
  store,
  render: h => h(App),
  created () {
    // TODO when the wamp router disconnects and reconnects the subscription gets lost
    // figure out how to have it resubscribe
    this.$wamp.subscribe('auv.update', function(args) {
      this.$store.commit('UPDATE_AUV_DATA', args[0])
    })
    this.$wamp.subscribe('rc_control.update', function(args) {
      this.$store.commit('UPDATE_RC_DATA', args[0])
    })
  }
}).$mount('#app')
