import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)
let PLOT_LENGTH = 40

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
    navData: {},
    currentPosition: null,
    rcData: {armed: false},
    heading: null,
    roll: null,
    pitch: null,
    waypoint: null,
    plotHeadingData: [],
    plotTargetHeadingData: [],
    plotHeadingErrorData: [],
    plotPidOutputData: [],
    plotLabels: []
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
    UPDATE_NAV_DATA (state, data) {
      state.navData = data
      if (state.waypoint === null) {
        state.waypoint = data.target_waypoint
      }
      state.plotTargetHeadingData.push(data.target_heading)
      state.plotHeadingData.push(state.heading)
      state.plotHeadingErrorData.push(data.heading_error)
      state.plotPidOutputData.push(data.pid_output)
      state.plotLabels.push('')
      
      // if the plot data arrays get too long we remove
      // the first elements to keep them at the proper length
      if (state.plotHeadingData.length > PLOT_LENGTH) {
        state.plotTargetHeadingData.shift()
        state.plotHeadingData.shift()
        state.plotPidOutputData.shift()
        state.plotHeadingErrorData.shift()
        state.plotLabels.shift()
      }
    },
    UPDATE_GPS_DATA (state, data) {
      if (data.lat !== null) {
        state.currentPosition = {lat: data.lat, lng: data.lng}
      }
    },
    UPDATE_AHRS_DATA (state, data) {
      state.heading = data.heading
      state.roll = data.roll
      state.pitch = data.pitch
    },
    SET_AUV_STATUS (state, status) {
      state.auvStatus = status
    },
    SET_WAMP_STATUS (state, status) {
      state.wampStatus = status 
    },
    UPDATE_RC_DATA (state, data) {
      state.rcData = data
    }, 
    UPDATE_WAYPOINT (state, data) {
      state.waypoint = data
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
      this.$http.get('api/users/me/')
        .then(response => {
          context.commit('SET_USER', response.data)
        })
        .catch(error => {
          console.error(error)
        })
    },
    getAuvs (context) {
      this.$http.get('api/auvs/')
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
    },
  }
})
