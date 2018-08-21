<template>
  <section class="hero is-fullheight">
    <div class="hero-body">
      <div class="container has-text-centered">
        <div class="column is-4 is-offset-4">
          <p class="subtitle has-text-grey">Please login to proceed.</p>
          <div class="box">
            <form>
              <div class="field">
                <div class="control">
                  <input v-model="username" class="input is-large" type="text" placeholder="username" autofocus="">
                </div>
              </div>

              <b-field :type="passwordType" :message="passwordErrorMsg">
                <b-input type="password" size="is-large" v-model="password" placeholder="password">
              </b-input>
        </b-field>

              <div class="field">
                <label class="checkbox">
                  <input type="checkbox">
                  Remember me
                </label>
              </div>
              <!-- <button class="button is-block is-info is-large is-fullwidth" @click="login">Login</button> -->
              <a class="button is-block is-info is-large is-fullwidth" @click="login">Login</a>
            </form>
          </div>
          <p class="has-text-grey">
            <a href="../">Sign Up</a> &nbsp;·&nbsp;
            <a href="../">Forgot Password</a> &nbsp;·&nbsp;
            <a href="../">Need Help?</a>
          </p>
        </div>
      </div>
    </div>
  </section>

</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      username: '',
      password: '',
      passwordType: '',
      passwordErrorMsg: 'error'
    }
  },
  methods: {
    login () {
      console.log('login')
      let vm = this
        
      this.$http.post('api/auth/login/', {}, {
        headers: {},
        auth: {
          username: this.username,
          password: this.password
        }
      })
        .then( (response) => {
          console.info(response)
          vm.$store.commit('SET_USER', response.data.user)
          let token = response.data.token
          localStorage.setItem('authToken', token)
          vm.$http.defaults.headers.common['Authorization'] = 'Token ' + token
          vm.$router.push('dash')
        })
        .catch( (error) => {
          console.error(error)
          vm.passwordType = 'is-danger'
          vm.passwordErrorMsg = 'Invalid username or password'
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
