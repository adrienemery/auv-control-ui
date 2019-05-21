<template>
  <div class="box">
    <h5 class="title is-5">Set Your Account Password</h5>
    <form>        
        <b-field label="">
            <b-input v-model="password" type="password" placeholder='password'></b-input>
        </b-field>
        <button class="button is-primary" @click="activateAccount">Save</button>     
    </form>
  </div>
</template>

<script>
export default {
  name: 'forgotPassword',
  data () {
    return {
        password: ''
    }
  },
  methods: {
      activateAccount () {
        let data = {
            'uid': this.$route.params.uid,
            'token': this.$route.params.token,
            'new_password': this.password
        }
        this.$http.post('api/users/activate/', data)
            .then((response) => this.$router.push('/login'))
            .catch((response) => console.log())
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
