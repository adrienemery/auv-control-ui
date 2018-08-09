<template>
    <div class='section'>
        <h3 class="header">Motor Controls</h3>

        <div class="control">
            <label class="radio">
                <input type="radio" value="individual" v-model="mode"> Individual Motor
            </label>

            <div class="columns">
                <div class="column">
                    <p>Left Motor: {{leftMotorSpeed}} %
                        <button class="button is-info is-pulled-right" @click="leftMotorSpeed = 0">Zero</button>
                    </p>
                    <div class="slidecontainer">
                        <input type="range" min="-100" max="100" value="0" class="slider" id="myRange" v-model="leftMotorSpeed" :disabled="mode !== 'individual'">
                    </div>
                </div>
                <div class="column">
                    <p>Right Motor: {{rightMotorSpeed}} %
                        <button class="button is-info is-pulled-right" @click="rightMotorSpeed = 0">Zero</button>
                    </p>
                    <div class="slidecontainer">
                        <input type="range" min="-100" max="100" value="0" class="slider" id="myRange" v-model="rightMotorSpeed" :disabled="mode !== 'individual'">
                    </div>
                </div>
            </div>

            <label class="radio">
                <input type="radio" value="dual" v-model="mode"> Steering Control
            </label>

            <div class="columns">
                <div class="column">
                    <p>Throttle: {{throttleVal}} %
                        <button class="button is-info is-pulled-right" @click="throttleVal = 0">Zero</button>
                    </p>
                    <div class="slidecontainer">
                        <input type="range" min="-100" max="100" value="50" class="slider" id="myRange" v-model="throttleVal" :disabled="mode !== 'dual'">
                    </div>
                </div>
                <div class="column">
                    <p>Turn: {{turnVal}} %
                        <button class="button is-info is-pulled-right" @click="turnVal = 0">Zero</button>
                    </p>
                    <div class="slidecontainer">
                        <input type="range" min="-100" max="100" value="50" class="slider" id="myRange" v-model="turnVal" :disabled="mode !== 'dual'">
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
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="auvData">
                                <td>{{auvData.left_motor_speed}}</td>
                                <td>{{auvData.right_motor_speed}}</td>
                                <td>{{auvData.throttle}}</td>
                                <td>{{auvData.turn_speed}}</td>
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
                            <tr v-if="auvData">
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                    <h3>AHRS</h3>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>X</th>
                                <th>Y</th>
                                <th>Z</th>
                                <th>Heading</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="auvData">
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div>

        </div>

    </div>

</template>

<script>
import { mapState } from "vuex";

export default {
  name: "debug",
  data() {
    return {
      leftMotorSpeed: 0,
      rightMotorSpeed: 0,
      turnVal: 0,
      throttleVal: 0,
      mode: "individual",
      auvData: null
    };
  },
  wamp: {
    subscribe: {
      "auv.update": {
        acknowledge: true,
        function(args, kwArgs, details) {
          this.auvData = args[0];
        }
      }
    }
  },
  watch: {
    leftMotorSpeed(newVal, oldVal) {
      this.setLeftMotor(newVal);
    },
    rightMotorSpeed(newVal, oldVal) {
      this.setRightMotor(newVal);
    },
    turnVal(newVal, oldVal) {
      if (newVal > 0) {
        this.turnRight(newVal);
      } else if (newVal < 0) {
        this.turnLeft(newVal);
      } else {
        this.moveCenter();
      }
    },
    throttleVal(newVal, oldVal) {
      if (newVal > 0) {
        this.moveForward(newVal);
      } else {
        this.moveReverse(newVal);
      }
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
    turnRight(speed) {
      this.$wamp.call("auv.move_right", [speed]);
    },
    turnLeft(speed) {
      this.$wamp.call("auv.move_left", [speed]);
    },
    moveCenter(speed) {
      this.$wamp.call("auv.move_center", []);
    },
    moveForward(speed) {
      this.$wamp.call("auv.forward_throttle", [speed]);
    },
    moveReverse(speed) {
      this.$wamp.call("auv.reverse_throttle", [speed]);
    }
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
