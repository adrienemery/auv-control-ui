<template>
  <section class="hero is-fullheight login">
      <div class="has-text-centered">
        <div class="column is-4 is-offset-4">
          <!-- <span class="icon"><i class="fas fa-3x fa-ship logo"></i></span> -->
          <img src="../assets/submarine-100.png" alt="">
          <p class="subtitle has-text-grey">AUV Control</p>
          <router-view></router-view>
        </div>
      </div>
  </section>

</template>

<script>
export default {
  name: 'login',
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .logo {
    margin-bottom: 0.75em;
  }

  .login {
    background: white;
  }

  .login-btn {
    background: #89bdd3;
  }

</style>
