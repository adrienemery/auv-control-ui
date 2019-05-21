<template>
  <div class="section">

    <div class="columns">

      <!-- Left Hand Side -->
      <div class="column is-half">

        <!-- Top Buttons -->
        <div class="buttons" style="margin-bottom: 20px; margin-top: 5px">
          <button class="button is-info" @click="startTrip">Start</button>
          <button class="button" @click='stop'>Pause</button>
          <button class="button" @click='resumeTrip'>Resume</button>
          <button class="button is-success is-pulled-right" @click="addWaypoint">+WP</button>
          <button class="button is-danger is-pulled-right" @click="removeWaypoint">-WP</button>
          <button class="button is-pulled-right" @click="clearTrip">Clear Trip</button>
        </div>

        <!-- Map -->
        <div ref="map" id="map"></div>
      </div>

      <!-- Right Hand Side -->
      <div class="column is-half">
         <b-tabs v-model="activeTab">

            <b-tab-item label="Charts">
              <div class="chart">
                <!-- Charts -->
                <line-chart :chart-data="plotData" :options="plotOptions" :height="200"/>        
                <line-chart :chart-data="pidPlotData" :options="pidPlotOptions" :height="200"/>
              </div>
            </b-tab-item>

            <b-tab-item label="Camera">
                <img :src="img" alt="" height="400px">
            </b-tab-item>

        </b-tabs>
        
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex"
import LineChart from '@/components/LineChart'

export default {
  name: "dashboard",
  components: {
    LineChart
  },
  computed: {
    ...mapState([
      'img',
      'currentPosition',
      'auvData',
      'navData',
      'plotLabels',
      'plotHeadingData',
      'plotHeadingData',
      'waypoint',
      'trip',
      'plotTargetHeadingData',
      'plotHeadingErrorData',
      'plotPidOutputData',
      'heading',
      'waypointCircleRadius',
    ]),
    ...mapGetters([
      'numCompletedWaypoints',
    ]),
    asvPosition() {
      return this.currentPosition
    },
  },
  data() {
    return {
      activeTab: 0,
      center: { lat: 49.2827, lng: -123.1207 },
      showAsvMarker: true,
      showMarkerCircles: true,
      tripMarkers: [],
      tripCircles: [],
      plotData: null,
      pidPlotData: null,
      flagIcon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
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
    this.getUserLocation()  
    if (this.currentPosition) {
      this.center = this.currentPosition
    }
  },
  mounted () {
    this.initMap()
  },
  watch: {
    numCompletedWaypoints (newVal, oldVal) {
      for (var i=0; i < this.tripMarkers.length; i++) {
        // if we have completed this waypoint then we set a new icon
        // so its clear to visually determine which waypoints have been completed
        if (i < this.numCompletedWaypoints) {
          let marker = this.tripMarkers[i]
          if (marker.getIcon() !== this.flagIcon){
            marker.setIcon(this.flagIcon)
          }
        }
      }
    },
    trip (newVal, oldVal) {
      this.updateTrip()
    },
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
    getUserLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          console.log(position)
        })
      } else {
        console.log("Geolocation is not supported by this browser")
      }
    },
    initMap() {
      this.map = new google.maps.Map(this.$refs.map, {
        zoom: 17, 
        center: this.center,
        disableDefaultUI: true,
        zoomControl: true,
      })
      
      let vm = this
      this.map.addListener('center_changed', function() {
        vm.updateMapCenter()
      });

      this.asvMarker = new google.maps.Marker({
        position: this.currentPosition, 
        map: this.map,           
        icon: {
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 3,
          rotation: this.heading
        },
      })
      this.updateTrip()
    },
    clearTrip() {
      this.deleteMarkers()
      this.$store.commit('CLEAR_TRIP')
    },
    deleteMarkers() {
      for (var i = 0; i < this.tripMarkers.length; i++) {
        this.tripMarkers[i].setMap(null)
      }
      this.tripMarkers = []
      for (var i = 0; i < this.tripCircles.length; i++) {
        this.tripCircles[i].setMap(null)
      }
      this.tripCircles = []
    },
    updateTrip() {
      // redraw the trip markers
      this.deleteMarkers()
      for (let i=0; i<this.trip.length; i++) {
        let waypoint = this.trip[i]
        let marker = new google.maps.Marker({
          position: waypoint, 
          draggable: true,
          map: this.map, 
          label: (i + 1).toString()
        })         
        var circle = new google.maps.Circle({
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 1,
          fillColor: '#FF0000',
          fillOpacity: 0.35,
          map: this.map,
          center: waypoint,
          radius: this.waypointCircleRadius
        })
        this.tripCircles.push(circle)
        this.tripMarkers.push(marker)
        let vm = this
        marker.addListener('dragend', function() {
          vm.updateTripMarker(i)
        })  
      }
    },
    updateTripMarker(index) {
      this.trip[index] = this.tripMarkers[index].getPosition()
      this.tripCircles[index].setCenter(this.tripMarkers[index].getPosition())
    },
    addWaypoint() {
      // add a waypoint to the trip
      this.$store.commit('ADD_WAYPOINT', this.map.getCenter())
    },
    removeWaypoint() {
      // remove the most recetn waypoint to the trip
      this.$store.commit('REMOVE_WAYPOINT')
    },
    updateMapCenter() {
      let center = this.map.getCenter()
      this.center.lat = center.lat()
      this.center.lng = center.lng()
    },
    moveToWaypoint() {
      this.$wamp.call("nav.move_to_waypoint", [this.waypoint])
    },
    startTrip() {
      this.updateTrip()
      this.$wamp.call("nav.start_trip", [this.trip])
    },
    resumeTrip() {
      this.$wamp.call("nav.resume_trip")
    },
    stop() {
      this.$wamp.call("nav.stop")
    },
  }
};
</script>

<style scoped>
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
    padding-top: 24px;
    width: 100%;
  }
</style>
