<template>
  <div>
    <!-- Navbar -->
    <nav class="navbar has-shadow is-fixed-top">
        <!-- Icon -->
        <div class="navbar-brand">
          <div class="navbar-item">
              <span>WAMP: 
                <span v-if="wampStatus === 'Connected'" class="tag is-success">On</span>
                <span v-else class="tag is-danger">Off</span>
              </span>  
          </div>
          <div class="navbar-item">
              <span>AUV: 
                <span v-if="auvStatus === 'Connected'" class="tag is-success">On</span>
                <span v-else class="tag is-danger">Off</span>
              </span>  
          </div>

          <div class="navbar-item">
            <span v-if="navData && navData.enabled">Auto: <span class="tag is-success">On</span></span>  
            <span v-else>Auto: <span class="tag is-danger">Off</span></span>
          </div>
          
          <div class="navbar-item">
            <span v-if="rcData.armed">RC: <span class="tag is-success">On</span></span>  
            <span v-else>RC: <span class="tag is-danger">Off</span></span>
          </div>
          <div class="navbar-item">
            <button class="button is-danger" @click="stop">Stop</button>
          </div>

          <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navMenu" @click="showNav = !showNav" :class="{ 'is-active': showNav }">
            <span></span>
            <span></span>
            <span></span>
          </a>
        </div>

        <div class="navbar-menu" :class="{ 'is-active': showNav }" v-if="showNav">
          <div class="navbar-end">
            <a class="navbar-item" @click="logout">
              Logout
            </a>
          </div>
        </div>

        <div id="navMenu" class="navbar-menu">
          <div class="navbar-end">
            <div class="navbar-item">
              <span class="icon"><i class="fa fa-2x fa-battery-three-quarters"></i></span>
            </div>
            <div class="navbar-item">
              <span class="name">75%</span>
            </div>
            <b-dropdown class="navbar-item">
              <a class="button" slot="trigger">
                  <b-icon icon="user-circle"></b-icon>
                  <span>{{user.first_name}}</span>
                  <b-icon icon="angle-down"></b-icon>
              </a>
              <b-dropdown-item has-link=true>
                <router-link to="/security"><span class="icon is-info"><i class="fa fa-lock"></i></span><span class="name">Security</span></router-link>
              </b-dropdown-item>
              <b-dropdown-item @click="logout">
                <span class="icon"><i class="fa fa-sign-out-alt"></i></span><span class="name">Logout</span>
              </b-dropdown-item>
            </b-dropdown>
          </div>
        </div>
    </nav>
    <!-- End Navbar -->

    <!-- Sidebar -->
    <aside class="sidebar hero is-fullheight is-hidden-mobile is-hidden-tablet-only">        
        <div class="menu">
          <ul class="menu-list">
            <li>
              <router-link to="/dash" active-class="is-active" class="sidebar-item has-text-left"><span class="icon"><i class="fa fa-tachometer-alt"></i></span><span class="name"> Dashboard</span></router-link>
            </li>
            <li>
              <router-link to="/controls" active-class="is-active" class="sidebar-item has-text-left"><span class="icon"><i class="fas fa-compass"></i></span><span class="name"> Navigation</span></router-link>
            </li>
            <li>
              <router-link to="/debug" active-class="is-active" class="sidebar-item has-text-left"><span class="icon"><i class="fas fa-terminal"></i></span><span class="name"> Debug</span></router-link>
            </li>
            <li>
              <router-link to="/settings" active-class="is-active" class="sidebar-item has-text-left"><span class="icon"><i class="fas fa-cog"></i></span><span class="name"> Settings</span></router-link>
            </li>
            <li v-if="isAdmin">
              <router-link to="/team" active-class="is-active" class="sidebar-item has-text-left"><span class="icon"><i class="fas fa-users"></i></span><span class="name"> Team</span></router-link>
            </li>
          </ul>
      </div>      
    </aside>

    <aside class="sidebar-collapsed hero is-fullheight is-hidden-desktop">
        <div>
          <div class="menu">
            <ul class="menu-list">
              <li>
                <router-link to="/dash" active-class="is-active" class="sidebar-item"><span class="icon"><i class="fa fa-tachometer-alt"></i></span><span class="name"></span></router-link>
              </li>
              <li>
                <router-link to="/controls" active-class="is-active" class="sidebar-item"><span class="icon"><i class="fas fa-compass"></i></span><span class="name"></span></router-link>
              </li>
              <li>
                <router-link to="/debug" active-class="is-active" class="sidebar-item"><span class="icon"><i class="fas fa-terminal"></i></span><span class="name"></span></router-link>
              </li>
              <li>
                <router-link to="/settings" active-class="is-active" class="sidebar-item"><span class="icon"><i class="fas fa-cog"></i></span><span class="name"></span></router-link>
              </li>
              <li v-if="isAdmin">
                <router-link to="/team" active-class="is-active" class="sidebar-item has-text-left"><span class="icon"><i class="fas fa-users"></i></span><span class="name"></span></router-link>
              </li>
            </ul>
          </div>
        </div>
    </aside>
    <!-- End Sidebar -->

    <div class="main is-hidden-mobile is-hidden-tablet-only">
      <!-- Content Right Hand Side -->
        <router-view></router-view>
      <!-- End Content -->
    </div>
    <div class="main-collapsed is-hidden-desktop">
      <!-- Content Right Hand Side -->
        <router-view></router-view>
      <!-- End Content -->
    </div>
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
      showNav: false,
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

  html,body {
    font-family: 'Open Sans', serif;
    font-size: 14px;
    line-height: 1.5;
    height: 100%;
    background-color: #fff;
  }
  .main {
    margin-left: 150px;
    overflow: scroll;
  }
  .main-collapsed {
    margin-left: 50px;
    overflow: scroll;
  }
  .sidebar {
    width: 150px;
    display: block;
    background-color: #F9F9F9;
    border-right: 1px solid #dedede;
    position: fixed;
    top: 50px;
    z-index: 1;
  }
  .sidebar-collapsed {
    width: 50px;    
    display: block;
    background-color: #F9F9F9;
    border-right: 1px solid #dedede;
    position: fixed;
    top: 30;
    z-index: 1;
  }
  .sidebar-item {
    margin: 0.1em;
    color: gray;
  }
  .sidebar-top-btn {
    margin: 1em;
  }
</style>
