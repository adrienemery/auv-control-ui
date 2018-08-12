import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    auvStatus: 'Disconnected',
    controlMode: 'Manual',
    auvData: {},
  },
  mutations: {
    UPDATE_AUV_DATA (state, data) {
      state.auvData = data
    },
    SET_AUV_STATUS (state, status) {
      state.auvStatus = status
    }
  },
  actions: {

  }
})
