<template>
  <div>
    <v-card outlined>
      <v-card-text>
        <v-form>
          <v-text-field
            label="Email"
            name="email"
            type="text"
          ></v-text-field>

          <v-layout justify-space-between>
              <v-btn color="primary">Reset Password</v-btn>
              <router-link to="/login" class="text--secondary">Login</router-link>
          </v-layout>  
        </v-form>
      </v-card-text>
    </v-card>
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
