<template>
    <div class='section'>
        <div class="columns">
            <div class="column is-3">
                <h1>PID</h1>
                <b-field label="Kp">
                    <b-input type="number" step="0.01" size="is-large" v-model="kP" placeholder="kP"></b-input>
                </b-field>
                <b-field label="Ki">
                    <b-input type="number" step="0.01" size="is-large" v-model="kI" placeholder="kI"></b-input>
                </b-field>
                <b-field label="Kd">
                    <b-input type="number" step="0.01" size="is-large" v-model="kD" placeholder="kD"></b-input>
                </b-field>
                <b-field label="PID Error Debounce">
                    <b-input type="number" size="is-large" placeholder="pid_debounce"></b-input>
                </b-field>
                <button class="button is-info" @click="setPidValues">Save</button>
            </div>
            <div class="column is-3">
                <h1>Waypoints</h1>
                <b-field label="Waypoint Distance">
                    <b-input type="number" size="is-large" placeholder="waypoint_distance"></b-input>
                </b-field>                
            </div>
            <div class="column is-3">
                <h1>AHRS</h1>
                <b-field label="Declination">
                    <b-input v-model="declination" type="number" size="is-large" placeholder="declination"></b-input>
                </b-field>                
                <button class="button is-info" @click="setDeclination">Save</button>
            </div>
        </div>
    </div>

</template>

<script>
import { mapState } from "vuex";

export default {
  name: "controls",
  computed: {
    ...mapState([
      'auvData',
      'controlData'
    ])
  },
  created () {
    this.getPidValues()  
  },
  data() {
    return {
      kP: 1,
      kI: 0,
      kD: 0,
      refreshRate: null,
      declination: 0,
    };
  },
  methods: {
    getPidValues() {
      this.$wamp.call("nav.get_pid_values").then(
        response => {
            console.log(response)
            this.kP = response.kP
            this.kI = response.kI
            this.kD = response.kD
        },
        error => {
          console.log(error);
        }
      );
    },
    setPidValues() {
      this.$wamp.call("nav.set_pid_values", [this.kP, this.kI, this.kD]).then(
        response => {
            this.getPidValues()
        },
        error => {
          console.log(error);
        }
      );
    },
    setDeclination() {
      this.$wamp.call("ahrs.set_declination", [this.declination]).then(
        response => {
          // none
        },
        error => {
          console.log(error);
        }
      );
    }

  }
};
</script>

<style>

</style>
