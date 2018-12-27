<template>
    <div class='section'>
        <div class="columns">
            <!-- Left Hand Side -->
            <div class="column">
                <h1 class="title is-4">Change Password</h1>
                <form>
                    <b-field label="Current Password" :type="passwordType" :message="passwordErrorMsg">
                        <b-input v-model="currentPassword" type="password"></b-input>
                    </b-field>
                    <b-field label="New Password">
                        <b-input v-model="newPassword" type="password"></b-input>
                    </b-field>
                    <button class="button is-primary" @click="resetPassword">Reset Password</button>     
                </form>
            </div>
            <!-- End Left Hand Side -->

            <!-- Right Hand Side -->
             <div class="column">
             </div>
             <!-- End Right Hand Sid -->
        </div>
        
    </div>

</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'security',
    computed: {
        ...mapState([
        'activeAuv'
        ])
    },
    data () {
        return {
            newPassword: '',
            currentPassword: '',
            passwordErrorMsg: '',
            showMsg: false,
        }
    },
    watch: {
        currentPassword (newVal, oldVal) {
            this.passwordType = ''
            this.passwordErrorMsg = ''
        }
    },
    methods: {
        resetPassword () {
            let vm = this
            let data = {
                new_password: this.newPassword,
                current_password: this.currentPassword
            }
            this.$http.post('api/password', data)
                .then(response => {
                    
                })
                .catch(error => {
                    vm.passwordType = 'is-danger'
                    vm.passwordErrorMsg = 'Wrong password'
                    console.log(error)
                })
        }
    }
}

</script>

<style>

</style>
