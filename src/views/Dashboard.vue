<template>
    <div class='section'>
      <div class="buttons" style="margin-bottom: 20px">
        <button class="button is-info" @click="moveToWaypoint">Move To Waypoint</button>
        <button class="button is-pulled-right" @click="showAsvMarker = !showAsvMarker">Toggle ASV</button>
        <button class="button is-pulled-right" @click="waypoint.lat = center.lat; waypoint.lng = center.lng">Center WP</button>
      </div>
      <div class="control">
        <gmap-map ref="map" :center="center" :zoom="15" @dragend="updateMapCenter" style="width:100%;  height: 400px;">
          <gmap-marker 
            v-if="showAsvMarker"
            :position="currentPosition"
            :label="'asv'"
            :clickable="true"
          ></gmap-marker>
          <gmap-marker id='waypoint'
            :clickable="true"
            :draggable="true"
            :label="'WP'"
            :position="waypoint"
            @dragend="updateWaypoint"
          ></gmap-marker>
          
        </gmap-map>

        <hr>

        <div class="columns">
            <div class="column">
                <p>Throttle: {{auvData.throttle}} %
                    <button class="button is-info is-pulled-right" @click="throttleVal = 0">Zero</button>
                </p>
                <div class="slidecontainer">
                    <input type="range" min="-100" max="100" value="50" class="slider" id="myRange" v-model="throttleVal">
                </div>
            </div>
            <div class="column">
                <p>Turn: {{auvData.turn_speed}} %
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
  name: "dashboard",
  computed: {
    ...mapState([
      'currentPosition',
      'auvData'
    ]),
  },
  data() {
    return {
      turnVal: 0,
      throttleVal: 0,
      center: { lat: 49.2827, lng: -123.1207 },
      waypoint: { lat: 49.2827, lng: -123.1207 },
      turnLock: false,
      throttleLock: false,
      showAsvMarker: true,
    };
  },
  created () {
    this.throttleLock = true
    this.turnLock = false
    this.turnVal = this.auvData.turn_speed
    this.throttleVal = this.auvData.throttle
    console.log(this.auvData)
    this.turnLock = false
    this.throttleLock = false
  },
  watch: {
    turnVal(newVal, oldVal) {
      if (!this.turnLock) {
        if (newVal > 0) {
          this.turnRight(newVal);
        } else if (newVal < 0) {
          this.turnLeft(newVal);
        } else {
          this.moveCenter();
        }
      }
    },
    throttleVal(newVal, oldVal) {
      if (!this.throttleLock) {
        if (newVal >= 0) {
          this.moveForward(newVal);
        } else {
          this.moveReverse(newVal);
        }
      }
    }
  },
  methods: {
    updateMapCenter() {
      this.center.lat = this.$refs.map.$mapObject.center.lat()
      this.center.lng = this.$refs.map.$mapObject.center.lng()
    },
    updateWaypoint(event) {
      this.waypoint.lat = event.latLng.lat()
      this.waypoint.lng = event.latLng.lng()
    },
    moveToWaypoint() {
      this.$wamp.call("nav.move_to_waypoint", [this.waypoint])
    },
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
      if (speed !== null) {
        this.$wamp.call("auv.forward_throttle", [speed]);
      }
    },
    moveReverse(speed) {
      if (speed !== null) {
        this.$wamp.call("auv.reverse_throttle", [speed]);
      }
    }
  }
};
</script>

<style>
  .map-icon-label .map-icon {
    font-size: 8px;
    color: #FFFFFF;
    line-height: 10px;
    text-align: center;
    white-space: nowrap;
  }
</style>
