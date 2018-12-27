<template>
  <div class="box">
    <form>
      <div class="field">
        <div class="control">
            <input v-model="email" class="input is-large" type="text" placeholder="email" autofocus="">
        </div>
      </div>
      <button class="button is-block login-btn is-large is-fullwidth">Reset Password</button>
    </form>
    <router-link to="/login">Login</router-link>
  </div>
</template>

<script>
export default {
  name: 'forgotPassword',
  data () {
    return {
        email: ''
    }
  },
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
