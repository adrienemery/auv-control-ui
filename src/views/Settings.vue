<template>
    <div class='settings'>
        <div class="columns">
            <!-- Left Hand Side -->
            <div class="column">
                <div class="section">
                    <h3>Remote ASV Config</h3>
                    <p>These settings define the AUV in the master database</p>
                    <b-field label="Name">
                        <b-input v-model="name"></b-input>
                    </b-field>
                    <b-field label="ID">
                        <b-input v-model="id" disabled></b-input>
                    </b-field>

                    <hr>
                    
                    <h4>WAMP Network</h4>
                    <p> These are the connection settings for the internet facing WAMP router.
                        The settings need to be transfered to the ASV in order to have control
                        over the internet.
                    </p>
                    <b-field label="Wamp URL">
                        <b-input v-model="wampUrl" disabled></b-input>
                    </b-field>
                    <b-field label="Wamp Realm">
                        <b-input v-model="wampRealm" disabled></b-input>
                    </b-field>
                    <b-field label="Wamp Auth"></b-field>
                    <b-field grouped>
                        <b-input v-model="wampAuthToken" type="password" expanded password-reveal disabled></b-input>
                        <p class="control">
                            <button class="button is-info"><span class="icon"><i class="fas fa-redo"></i></span><span>New Token</span></button> 
                        </p>
                    </b-field>

                </div>
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
    name: 'settings',
    data () {
        return {
            name: "ASV V1",
            wampAuthToken: 'asflajflqkwjrlqwkjlkslajlsfadfaf',
            wampUrl: 'ws://localhost:8090/ws',
            wampRealm: 'realm-821bf4f6',
            id: "821bf4f6"
        }
    }

}
</script>

<style>

</style>
