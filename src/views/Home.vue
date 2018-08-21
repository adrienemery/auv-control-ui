<template>
  <div>

    <!-- Navbar -->
    <nav class="navbar has-shadow">
        <!-- Icon -->
        <div class="navbar-brand">
          <a class="navbar-item" href="../">
            <img src="http://bulma.io/images/bulma-logo.png" alt="Bulma: a modern CSS framework based on Flexbox">
          </a>
          <div class="navbar-item">
              <span><strong>WAMP Status:</strong> {{ auvStatus }}</span>
          </div>
          <div class="navbar-item">
              <span><strong>RC Armed:</strong> {{ rcData.armed }}</span>
          </div>

          <div class="navbar-burger burger" data-target="navMenu">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div class="navbar-menu">
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
      <aside class="sidebar hero is-fullheight">
          <div>
            <div class="menu">
              <ul class="menu-list">
                <li>
                  <router-link to="/dash" active-class="is-active" class="sidebar-item has-text-left"><span class="icon"><i class="fa fa-tachometer-alt"></i></span><span class="name"> Dashboard</span></router-link>
                </li>
                <li>
                  <router-link to="#routes" active-class="is-active" class="sidebar-item has-text-left"><span class="icon"><i class="fa fa-map"></i></span><span class="name"> Routes</span></router-link>
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
      <!-- End Sidebar -->

      <!-- Content Right Hand Side -->
      <div class="content">
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
      'auvStatus',
      'auvData',
      'rcData',
      'controlMode',
      'user'
    ])
  },
  created () {
    console.log('created')
    this.$store.dispatch('getAuvs')
  },
  mounted () {
    // this.$wamp.publish('some-topic', [], {val: 20});
  },
  methods: {
    logout: function () {
      localStorage.removeItem('authToken')
      this.$router.push('/login')
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
    grid-template-columns: 200px 1fr;
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
