<template>
    <div class='settings'>
        <div class="columns">
            <!-- Left Hand Side -->
            <div class="column">
                <div class="section" v-if="activeAuv">
                    <b-field label="Name">
                        <b-input v-model="activeAuv.name"></b-input>
                    </b-field>
                    <b-field label="ID">
                        <b-input v-model="activeAuv.auv_id" disabled></b-input>
                    </b-field>

                    <hr>
                    
                    <h4>WAMP Network</h4>
                    <p> These are the connection settings for the internet facing WAMP router.
                        The settings need to be transfered to the ASV in order to have control
                        over the internet.
                    </p>
                    <b-field label="Wamp URL">
                        <b-input v-model="activeAuv.wamp_url" disabled></b-input>
                    </b-field>
                    <b-field label="Wamp Realm">
                        <b-input v-model="activeAuv.wamp_realm" disabled></b-input>
                    </b-field>
                    <b-field label="Wamp Auth"></b-field>
                    <b-field grouped>
                        <b-input v-model="activeAuv.api_token" type="password" expanded password-reveal disabled></b-input>
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
    computed: {
        ...mapState([
        'activeAuv'
        ])
    },
    data () {
        return {
        }
}

}
</script>

<style>

</style>
