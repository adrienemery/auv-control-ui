<template>
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
            <button class="button is-block login-btn is-large is-fullwidth" @click="login">Login</button>
        </form>
        <router-link to="forgot-password">Forgot Password</router-link>
    </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      username: '',
      password: '',
      passwordType: '',
      passwordErrorMsg: ''
    }
  },
  beforeMount () {
    if (this.$wamp.isOpen()) {
      this.$wamp.close()
    }
  },
  watch: {
    password(newVal, oldVal) {
      this.passwordType = ''
      this.passwordErrorMsg = ''
    }
  },
  methods: {
    login () {
      console.log('login')
      let vm = this
       
      this.$http.post('api/auth/token/login/', {}, {
        headers: {},
        auth: {
          username: this.username,
          password: this.password
        }
      })
        .then( (response) => {
          if (response.status === 200) {
            vm.$store.commit('SET_USER', response.data.user)
            let token = response.data.token
            localStorage.setItem('authToken', token)
            this.$wamp.open()
            vm.$router.push('dash')
          } else {
            vm.passwordType = 'is-danger'
            vm.passwordErrorMsg = 'Invalid username or password'
          }
        })
        .catch( (error) => {
          console.error(error)
        })
    }
  }
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
