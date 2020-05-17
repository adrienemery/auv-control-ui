<template>
  <div>
    <!-- sidebar -->
    <v-navigation-drawer 
      app 
      clipped 
      :mini-variant.sync="mini"
      v-model="showDrawer"
      >
      <v-list nav>
        <v-list-item to="/dash">
          <v-list-item-icon>
            <v-icon>fa-tachometer-alt</v-icon>
          </v-list-item-icon>
          <v-list-item-title>
            Dashboard
          </v-list-item-title>
        </v-list-item>

        <v-list-item to="/controls">
          <v-list-item-icon>
            <v-icon>fa-compass</v-icon>
          </v-list-item-icon>
          <v-list-item-title>
            Navigation
          </v-list-item-title>
        </v-list-item>

        <v-list-item to="/debug">
          <v-list-item-icon>
            <v-icon>fa-terminal</v-icon>
          </v-list-item-icon>
          <v-list-item-title>
            Debug
          </v-list-item-title>
        </v-list-item>

        <v-list-item to="/settings">
          <v-list-item-icon>
            <v-icon>fa-cog</v-icon>
          </v-list-item-icon>
          <v-list-item-title>
            Setting
          </v-list-item-title>
        </v-list-item>

        <v-list-item to="/team">
          <v-list-item-icon>
            <v-icon>fa-users</v-icon>
          </v-list-item-icon>
          <v-list-item-title>
            Team
          </v-list-item-title>
        </v-list-item>
      </v-list>

      <div>
        <v-spacer></v-spacer>
        <v-btn icon @click.stop="mini = !mini">
          <v-icon v-if="!mini">fa-chevron-left</v-icon>
          <v-icon v-else>fa-chevron-right</v-icon>
        </v-btn>
      </div>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn block outlined color='primary'>Logout</v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- top bar -->
    <v-app-bar app clipped-left dark dense flat>
      <v-app-bar-nav-icon @click="showDrawer = !showDrawer"></v-app-bar-nav-icon>
      <v-chip 
        class="ma-2"
        :color="wampStatus === 'Connected' ? 'green' : 'red'">
        WAMP
      </v-chip>
      <v-chip 
        class="ma-2" 
        :color="auvStatus === 'Connected' ? 'green' : 'red'">
        AUV
      </v-chip>
      <v-chip 
        class="ma-2" 
        :color="navData && navData.enabled ? 'green' : ''">
        AutoPilot
      </v-chip>
      <v-chip 
        class="ma-2" 
        :color="rcData.armed ? 'green' : ''">
        RC
      </v-chip>
      <v-spacer></v-spacer>
      <v-btn color="info" outlined @click="stop">Stop</v-btn>
    </v-app-bar>

    <!-- Main content -->
    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'home',
  computed: {
    ...mapState([      
      'wampStatus',
      'auvStatus',
      'auvData',
      'navData',
      'rcData',
      'controlMode',
      'user',
    ]),
    ...mapGetters([
      'isAdmin',
    ]),
  },
  data() {
    return {
      mini: false,
      showDrawer: true,
    }
  },
  created () {

    // TODO when the wamp router disconnects and reconnects the subscription gets lost
    // figure out how to have it resubscribe
    this.$wamp.subscribe('auv.update', function(args) {
      this.$store.dispatch('updateAuvData', args[0])
    })
    this.$wamp.subscribe('rc_control.update', function(args) {
      this.$store.commit('UPDATE_RC_DATA', args[0])
    })
    this.$wamp.subscribe('gps.update', function(args) {
      this.$store.commit('UPDATE_GPS_DATA', args[0])
    })
    this.$wamp.subscribe('nav.update', function(args) {
      this.$store.commit('UPDATE_NAV_DATA', args[0])
    })
    this.$wamp.subscribe('ahrs.update', function(args) {
      this.$store.commit('UPDATE_AHRS_DATA', args[0])
    })
    this.$wamp.subscribe('camera.update', function(args) {
      this.$store.commit('UPDATE_CAMERA_DATA', args[0])
    })
    
    this.$store.dispatch('getUser')
    this.$store.dispatch('getAuvs')

    this.$router.push('dash')
  },
  methods: {
    logout() {
      localStorage.removeItem('authToken')
      this.$router.push('/login')
      // TOOD refresh page after logout to ensure the vuex store is cleared
    },
    stop() {
      this.$wamp.call('nav.stop')
    }
  }
}
</script>

<style scoped>

</style>
