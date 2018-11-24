<template>
  <div class="section">
    
    <!-- Top Buttons -->
    <div class="buttons" style="margin-bottom: 20px; margin-top: 5px">
      <button class="button is-info" @click="moveToWaypoint">Move To Waypoint</button>
      <button class="button is-pulled-right" v-if="showAsvMarker" @click="showAsvMarker = !showAsvMarker">Hide ASV</button>
      <button class="button is-pulled-right" v-else @click="showAsvMarker = !showAsvMarker">Show ASV</button>
      <button class="button is-pulled-right" @click="centerWaypoint">Center WP</button>
    </div>

    <div class="columns">
      <div class="column is-half">
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

      <div class="column chart is-half">
        <line-chart :chart-data="plotData" :options="plotOptions" :height="300"/>
      </div>

    </div>

    <div class="columns">
      <div class="column chart is-half">
        <line-chart :chart-data="pidPlotData" :options="pidPlotOptions" :height="300"/>
      </div>
      <div class="column">
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
              <td>{{parseInt(auvData.turn_speed)}}</td>
              <td>{{auvData.trim}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

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
      'plotLabels',
      'plotHeadingData',
      'plotHeadingData',
      'waypoint',
      'plotTargetHeadingData',
      'plotHeadingErrorData',
      'plotPidOutputData',
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
      plotData: null,
      pidPlotData: null,
      pidPlotOptions: {
        animation: false,
        responsive: true,
        maintainAspectRatio: false,
        backgroundColor: 'black',
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              min: -100,
              stepSize: 20,
              max: 100
            }
          }],
        }
      },
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
    this.turnLock = false
    this.throttleLock = false
    if (this.currentPosition) {
      this.center = this.currentPosition
    }
  },
  watch: {
    navData(newData, oldData) {
      this.plotData = {
        labels: this.plotLabels,
        backgroundColor: 'black',
        datasets: [
          { 
            fill: false,
            label: 'Target Heading',
            borderColor: 'blue',
            data: this.plotTargetHeadingData,
            pointRadius: 0,
          },
          { 
            fill: false,
            label: 'Heading',
            borderColor: 'green',
            data: this.plotHeadingData,
            pointRadius: 0,
          },
          
        ]
      }
      this.pidPlotData = {
        labels: this.plotLabels,
        backgroundColor: 'black',
        datasets: [
          { 
            fill: false,
            label: 'PID Error',
            borderColor: 'red',
            data: this.plotHeadingErrorData,
            pointRadius: 0,
          },
          { 
            fill: false,
            label: 'PID Output',
            borderColor: 'green',
            data: this.plotPidOutputData,
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
    centerWaypoint() {
      this.$store.commit('UPDATE_WAYPOINT', this.center)
    },
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
