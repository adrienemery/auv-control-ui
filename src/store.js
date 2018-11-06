import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

// setup axios to be accessible globally using "this.$http"
Object.defineProperty(Vuex.Store.prototype, '$http', {value: axios})

export default new Vuex.Store({
  state: {
    user: {},
    auvs: [],
    activeAuv: null,
    auvLastSeen: null,
    auvStatus: 'Disconnected',
    wampStatus: 'Disconnected',
    controlMode: 'Manual',
    auvData: {},
    rcData: {armed: false},
  },
  mutations: {
    SET_USER (state, data) {
      state.user = data
    },
    SET_AUVS (state, data) {
      state.auvs = data
      if (state.auvs.length == 1) {
        state.activeAuv = state.auvs[0]
      }
    },
    SET_ACTIVE_AUV (state, data) {
      state.activeAuv = data
    },
    UPDATE_AUV_DATA (state, data) {
      state.auvData = data
      state.auvStatus = 'Connected'
      state.auvLastSeen = Date.now()
    },
    SET_AUV_STATUS (state, status) {
      state.auvStatus = status
    },
    SET_WAMP_STATUS (state, status) {
      state.wampStatus = status 
    },
    UPDATE_RC_DATA (state, data) {
      state.rcData = data
    } 
  },
  actions: {
    updateAuvData (context, data) {
      context.commit('UPDATE_AUV_DATA', data)
      setTimeout(function () {
        if (Date.now() - context.state.auvLastSeen > 5000) {
          context.commit('SET_AUV_STATUS', 'Disconnected')
        }
      }, 6000)
    },
    getUser (context) {
      this.$http.get('api/users/me')
        .then(response => {
          context.commit('SET_USER', response.data)
        })
        .catch(error => {
          console.error(error)
        })
    },
    getAuvs (context) {
      this.$http.get('api/auvs')
        .then(response => {
          context.commit('SET_AUVS', response.data)
        })
        .catch(error => {
          console.error(error)
        })
    },
    updateAuv (context, data) {
      let id = context.state.activeAuv.id
      this.$http.patch('api/auvs/' + id + '/', data)
        .then(response => {
          context.state.commit('SET_AUV', response.data)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
})
