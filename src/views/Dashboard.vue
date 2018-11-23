<template>
  <div class='section'>
    
    <!-- Top Buttons -->
    <div class="buttons" style="margin-bottom: 20px">
      <button class="button is-info" @click="moveToWaypoint">Move To Waypoint</button>
      <button class="button is-pulled-right" v-if="showAsvMarker" @click="showAsvMarker = !showAsvMarker">Hide ASV</button>
      <button class="button is-pulled-right" v-else @click="showAsvMarker = !showAsvMarker">Show ASV</button>
      <button class="button is-pulled-right" @click="waypoint.lat = center.lat; waypoint.lng = center.lng">Center WP</button>
    </div>

    <div class="columns">
      <div class="column">
        <!-- Map -->
        <gmap-map ref="map" :center="center" :zoom="15" @dragend="updateMapCenter" style="height: 300px; min-width:300px;">
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
        <!-- End map -->
      </div>

      <div class="column chart">
        <line-chart :chart-data="plotData" :options="plotOptions" :height="300"/>
      </div>
      
    </div>

    <hr>

    {{navData}}

    <!-- <div class="columns">
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
    </div> -->
  </div>
</template>

<script>
import { mapState } from "vuex"
import LineChart from '@/components/LineChart'

export default {
  name: "dashboard",
  components: {
    LineChart
  },
  computed: {
    ...mapState([
      'currentPosition',
      'auvData',
      'navData',
      'waypoint',
      'heading',
    ]),
  },
  data() {
    return {
      turnVal: 0,
      throttleVal: 0,
      center: { lat: 49.2827, lng: -123.1207 },
      turnLock: false,
      throttleLock: false,
      showAsvMarker: true,
      targetHeadingData: [],
      headingData: [],
      plotLabels: [],
      plotData: null,
      plotOptions: {
        animation: false,
        responsive: true,
        maintainAspectRatio: false,
        backgroundColor: 'black',
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              min: 0,
              stepSize: 60,
              max: 360
            }
          }],
        }
      },
    }
  },
  created () {
    this.throttleLock = true
    this.turnLock = false
    this.turnVal = this.auvData.turn_speed
    this.throttleVal = this.auvData.throttle
    console.log(this.auvData)
    this.turnLock = false
    this.throttleLock = false
    if (this.currentPosition) {
      this.center = this.currentPosition
    }
  },
  watch: {
    navData(newData, oldData) {
      let plotLength = 50
      this.targetHeadingData.push(newData.target_heading)
      this.headingData.push(this.heading)
      this.plotLabels.push('')
      if (this.targetHeadingData.length > plotLength) {
        this.targetHeadingData.shift()
      }
      if (this.headingData.length > plotLength) {
        this.headingData.shift()
      }
      if (this.plotLabels.length > plotLength) {
        this.plotLabels.shift()
      }
      this.plotData = {
        labels: this.plotLabels,
        backgroundColor: 'black',
        datasets: [
          { 
            fill: false,
            label: 'Target Heading',
            borderColor: 'blue',
            data: this.targetHeadingData,
            pointRadius: 0,
          },
          { 
            fill: false,
            label: 'Heading',
            borderColor: 'green',
            data: this.headingData,
            pointRadius: 0,
          },
          
        ]
      }
    },
    currentPosition(newVal, oldVal) {
      if (oldVal === null) {
        this.center = newVal
      }
    },
    turnVal(newVal, oldVal) {
      if (!this.throttleLock && newVal !== null) {
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
      if (!this.throttleLock && newVal !== null) {
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
      this.$store.commit('UPDATE_WAYPOINT', {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      })
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
      if (speed !== undefined) {
        this.$wamp.call("auv.forward_throttle", [speed]);
      }
    },
    moveReverse(speed) {
      if (speed !== undefined) {
        this.$wamp.call("auv.reverse_throttle", [speed]);
      }
    }
  }
};
</script>

<style>
  .chart {
    max-width: 100%;
  }

  .map-icon-label .map-icon {
    font-size: 8px;
    color: #FFFFFF;
    line-height: 10px;
    text-align: center;
    white-space: nowrap;
  }
</style>
