<template>
    <div class='section'>
        <h3 class="header">Motor Controls</h3>

        <div class="control">
            
            <div class="columns">
                <div class="column">
                    <p>Left Motor: {{leftMotorSpeed}} %
                        <button class="button is-info is-pulled-right" @click="leftMotorSpeed = 0">Zero</button>
                    </p>
                    <div class="slidecontainer">
                        <input type="range" min="-100" max="100" value="0" class="slider" id="myRange" v-model="leftMotorSpeed">
                    </div>
                </div>
                <div class="column">
                    <p>Right Motor: {{rightMotorSpeed}} %
                        <button class="button is-info is-pulled-right" @click="rightMotorSpeed = 0">Zero</button>
                    </p>
                    <div class="slidecontainer">
                        <input type="range" min="-100" max="100" value="0" class="slider" id="myRange" v-model="rightMotorSpeed">
                    </div>
                </div>
                <div class="column ">
                    <p>Trim: {{trim}} %
                        <button class="button is-info is-pulled-right" @click="trim = 0">Zero</button>
                    </p>
                    <div class="slidecontainer">
                        <input type="range" min="-100" max="100" value="0" class="slider" id="myRange" v-model="trim">
                    </div>
                </div>
            </div>

            <div class="columns">
                <div class="column">
                    <p>Throttle: {{throttle}} %
                        <button class="button is-info is-pulled-right" @click="throttle = 0">Zero</button>
                    </p>
                    <div class="slidecontainer">
                        <input type="range" min="-100" max="100" value="0" class="slider" id="myRange" v-model="throttle">
                    </div>
                </div>
                <div class="column">
                    <p>Turn Speed: {{turnSpeed}} %
                        <button class="button is-info is-pulled-right" @click="turnSpeed = 0">Zero</button>
                    </p>
                    <div class="slidecontainer">
                        <input type="range" min="-100" max="100" value="0" class="slider" id="myRange" v-model="turnSpeed">
                    </div>
                </div>
            </div>

        </div>

        <div class="section">
            <div class="columns">                
                <div class="column">
                    <h3>Motors</h3>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Left Motor</th>
                                <th>Right Motor</th>
                                <th>Throttle</th>
                                <th>Turn Speed</th>
                                <th>Trim</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="auvData">
                                <td>{{auvData.left_motor_speed}}</td>
                                <td>{{auvData.right_motor_speed}}</td>
                                <td>{{auvData.throttle}}</td>
                                <td>{{auvData.turn_speed}}</td>
                                <td>{{auvData.trim}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="column">
                    <h3>GPS</h3>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Lat</th>
                                <th>Lon</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="currentPosition">
                                <td>{{currentPosition.lat}}</td>
                                <td>{{currentPosition.lng}}</td>
                            </tr>
                        </tbody>
                    </table>
                    <h3>AHRS</h3>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Roll</th>
                                <th>Pith</th>
                                <th>Heading</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="auvData">
                                <td>{{parseInt(roll)}}</td>
                                <td>{{parseInt(pitch)}}</td>
                                <td>{{parseInt(heading)}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div>

        </div>

        {{navData}}

    </div>

</template>

<script>
import { mapState } from "vuex";

export default {
  name: "debug",
  computed: {
    ...mapState([
      'auvData',
      'navData',
      'roll',
      'heading',
      'pitch',
      'currentPosition'
    ])
  },
  data() {
    return {
      leftMotorSpeed: 0,
      rightMotorSpeed: 0,
      throttle: 0,
      turnSpeed: 0,
      trim: 0,
      mode: "individual"
    };
  },
  watch: {
    leftMotorSpeed(newVal, oldVal) {
      this.setLeftMotor(newVal);
    },
    rightMotorSpeed(newVal, oldVal) {
      this.setRightMotor(newVal);
    },
    trim(newVal, oldVal) {
      this.setTrim(newVal);
    },
    turnSpeed(newVal, oldVal) {
      this.setTurnSpeed(newVal)
    },
    throttle(newVal, oldVal) {
      this.setThrottle(newVal)
    }
  },
  methods: {
    setLeftMotor(speed) {
      this.$wamp.call("auv.set_left_motor_speed", [speed]).then(
        response => {
          // console.log(response)
        },
        error => {
          console.log(error);
        }
      );
    },
    setRightMotor(speed) {
      this.$wamp.call("auv.set_right_motor_speed", [speed]).then(
        response => {
          console.log(response);
        },
        error => {
          console.log(error);
        }
      );
    },
    setTrim(trim) {
      this.$wamp.call("auv.set_trim", [trim]);
    },
    setTurnSpeed(speed) {
      this.$wamp.call("auv.set_turn_val", [speed]);
    },
    setThrottle(throttle) {
      this.$wamp.call("auv.set_throttle", [throttle]);
    },
  }
};
</script>

<style>
.slidecontainer {
  width: 100%; /* Width of the outside container */
}

/* The slider itself */
.slider {
  -webkit-appearance: none; /* Override default CSS styles */
  appearance: none;
  width: 100%; /* Full-width */
  height: 25px; /* Specified height */
  background: #d3d3d3; /* Grey background */
  outline: none; /* Remove outline */
  opacity: 0.7; /* Set transparency (for mouse-over effects on hover) */
  -webkit-transition: 0.2s; /* 0.2 seconds transition on hover */
  transition: opacity 0.2s;
}

/* Mouse-over effects */
.slider:hover {
  opacity: 1; /* Fully shown on mouse-over */
}

/* The slider handle (use -webkit- (Chrome, Opera, Safari, Edge) and -moz- (Firefox) to override default look) */
.slider::-webkit-slider-thumb {
  -webkit-appearance: none; /* Override default look */
  appearance: none;
  width: 25px; /* Set a specific slider handle width */
  height: 25px; /* Slider handle height */
  background: #4caf50; /* Green background */
  cursor: pointer; /* Cursor on hover */
}

.slider::-moz-range-thumb {
  width: 25px; /* Set a specific slider handle width */
  height: 25px; /* Slider handle height */
  background: #4caf50; /* Green background */
  cursor: pointer; /* Cursor on hover */
}
</style>
