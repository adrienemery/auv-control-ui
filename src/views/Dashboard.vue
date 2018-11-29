<template>
  <div class="section">
    
    <!-- Top Buttons -->
    <div class="buttons" style="margin-bottom: 20px; margin-top: 5px">
      <button class="button is-info" @click="moveToWaypoint">Move To Waypoint</button>
      <button class="button is-pulled-right" @click="centerWaypoint">Center WP</button>
    </div>

    <div class="columns">
      <div class="column is-half">
        <!-- Map -->
        <div ref="map" id="map"></div>
      </div>

      <div class="column chart is-half">
        <!-- Chart -->
        <line-chart :chart-data="plotData" :options="plotOptions" :height="200"/>
        <line-chart :chart-data="pidPlotData" :options="pidPlotOptions" :height="200"/>
      </div>

    </div>

    <div class="columns">
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
    asvPosition() {
      return this.currentPosition
    }
  },
  data() {
    return {
      center: { lat: 49.2827, lng: -123.1207 },
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
              stepSize: 25,
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
    if (this.currentPosition) {
      this.center = this.currentPosition
    }
  },
  mounted () {
    this.initMap()
  },
  watch: {
    currentPosition (newVal, oldVal) {
      // set the map center to the ASV position the first time data comes throught
      if (oldVal === null) {
        this.map.setCenter(newVal)
      }
    },
    heading (newVal, oldVal) {
      this.asvMarker.icon.rotation = newVal
      this.asvMarker.setIcon({
        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        scale: 3,
        rotation: newVal
      })
    },
    asvPosition (newVal, oldVal) {
      this.asvMarker.setPosition(newVal)
    },
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
  },
  methods: {
    initMap() {
      this.map = new google.maps.Map(this.$refs.map, {zoom: 15, center: this.center})
      this.asvMarker = new google.maps.Marker({
          position: this.currentPosition, 
          map: this.map,           
          icon: {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 3,
            rotation: this.heading
          },
      })
      this.waypointMarker = new google.maps.Marker({
          position: this.waypoint, 
          draggable: true,
          map: this.map, 
          label: 'WP'
      })
      let vm = this
      this.waypointMarker.addListener('dragend', function() {
        vm.updateWaypoint(vm.waypointMarker.getPosition())
      })
    },
    centerWaypoint() {
      this.updateMapCenter()
      this.waypointMarker.setPosition(this.center)
      this.$store.commit('UPDATE_WAYPOINT', this.center)
    },
    updateMapCenter() {
      let center = this.map.getCenter()
      this.center.lat = center.lat()
      this.center.lng = center.lng()
    },
    updateWaypoint(position) {
      this.$store.commit('UPDATE_WAYPOINT', {
        lat: position.lat(),
        lng: position.lng()
      })
    },
    moveToWaypoint() {
      this.$wamp.call("nav.move_to_waypoint", [this.waypoint])
    },
  }
};
</script>

<style>
  #map {
    width: 100%;
    height: 400px; 
    min-width:300px;
    background-color: grey;
  }

  .template {
    padding-top: 20px;
  }

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
  .section {
    width: 100%;
  }
</style>
