<template>
  <div>
    <!-- Navbar -->
    <nav class="navbar has-shadow">
        <!-- Icon -->
        <div class="navbar-brand">
          <a class="navbar-item" href="../">
            <img src="../assets/submarine-100.png" alt="AUV Control"><span></span> 
          </a>
          <div class="navbar-item">
              <span><strong>WAMP:</strong> {{ wampStatus }}</span>
          </div>
          <div class="navbar-item">
              <span><strong>AUV:</strong> {{ auvStatus }}</span>
          </div>
          <div class="navbar-item">
              <span v-if="rcData.armed"><strong>RC:</strong> On</span>
              <span v-else><strong>RC:</strong> Off</span>
          </div>
          <div class="navbar-item">
            <button class="button is-danger">Stop</button>
          </div>


          <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navMenu">
            <span></span>
            <span></span>
            <span></span>
          </a>
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
              <b-dropdown-item>
                <span class="icon"><i class="fa fa-cog"></i></span><span class="name">Settings</span>
              </b-dropdown-item>
              <b-dropdown-item @click="logout">
                <span class="icon"><i class="fa fa-sign-out-alt"></i></span><span class="name">Logout</span>
              </b-dropdown-item>
            </b-dropdown>
          </div>
        </div>
    </nav>
    <!-- End Navbar -->

    <div class="main">

      <!-- Sidebar -->
      <aside class="sidebar hero is-fullheight is-hidden-mobile">
          <div>
            <div class="menu">
              <ul class="menu-list">
                <li>
                  <router-link to="/dash" active-class="is-active" class="sidebar-item has-text-left"><span class="icon"><i class="fa fa-tachometer-alt"></i></span><span class="name"> Dashboard</span></router-link>
                </li>
                <li>
                  <router-link to="/controls" active-class="is-active" class="sidebar-item has-text-left"><span class="icon"><i class="fas fa-compass"></i></span><span class="name"> Navigation</span></router-link>
                </li>
                <li>
                  <router-link to="/settings" active-class="is-active" class="sidebar-item has-text-left"><span class="icon"><i class="fas fa-cog"></i></span><span class="name"> Settings</span></router-link>
                </li>
                <li>
                  <router-link to="/debug" active-class="is-active" class="sidebar-item has-text-left"><span class="icon"><i class="fas fa-terminal"></i></span><span class="name"> Debug</span></router-link>
                </li>
              </ul>
            </div>
          </div>
      </aside>
      <aside class="sidebar is-fullheight is-hidden-tablet">
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
                  <router-link to="/settings" active-class="is-active" class="sidebar-item"><span class="icon"><i class="fas fa-cog"></i></span><span class="name"></span></router-link>
                </li>
                <li>
                  <router-link to="/debug" active-class="is-active" class="sidebar-item"><span class="icon"><i class="fas fa-terminal"></i></span><span class="name"></span></router-link>
                </li>
              </ul>
            </div>
          </div>
      </aside>
      <!-- End Sidebar -->

      <!-- Content Right Hand Side -->
      <div class="content" style="overflow:scroll; height:100%;">
        <router-view></router-view>
      </div>
      <!-- End Content -->

    </div>
  </div>

</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'home',
  computed: {
    ...mapState([      
      'wampStatus',
      'auvStatus',
      'auvData',
      'rcData',
      'controlMode',
      'user'
    ])
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

    // this.$store.dispatch('getUser')
    // this.$store.dispatch('getAuvs')

    this.$router.push('dash')
  },
  methods: {
    logout: function () {
      localStorage.removeItem('authToken')
      this.$router.push('/login')
      // TOOD refresh page after logout to ensure the vuex store is cleared
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
    display: grid;
    grid-template-columns: 1fr 7fr;
  }
  .sidebar {
    display: block;
    background-color: #F9F9F9;
    border-right: 1px solid #dedede;
  }
  .sidebar-item {
    margin: 1em;
    color: gray;
  }
  .sidebar-top-btn {
    margin: 1em;
  }
</style>
