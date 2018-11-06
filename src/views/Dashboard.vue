<template>
    <div class='section'>
        <h3 class="header">Motor Controls</h3>
        <div class="control">
            <div class="columns">
                <div class="column">
                    <p>Throttle: {{throttleVal}} %
                        <button class="button is-info is-pulled-right" @click="throttleVal = 0">Zero</button>
                    </p>
                    <div class="slidecontainer">
                        <input type="range" min="-100" max="100" value="50" class="slider" id="myRange" v-model="throttleVal">
                    </div>
                </div>
                <div class="column">
                    <p>Turn: {{turnVal}} %
                        <button class="button is-info is-pulled-right" @click="turnVal = 0">Zero</button>
                    </p>
                    <div class="slidecontainer">
                        <input type="range" min="-100" max="100" value="50" class="slider" id="myRange" v-model="turnVal">
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import { mapState } from "vuex";

export default {
  name: "debug",
  computed: {
    ...mapState([
      'auvData'
    ])
  },
  data() {
    return {
      turnVal: 0,
      throttleVal: 0,
    };
  },
  watch: {
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
      if (newVal >= 0) {
        this.moveForward(newVal);
      } else {
        this.moveReverse(newVal);
      }
    }
  },
  methods: {
    turnRight(speed) {
      this.$wamp.call("auv.move_right", [speed]);
    },
    turnLeft(speed) {
      this.$wamp.call("auv.move_left", [speed]);
    },
    moveCenter() {
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
</style>
