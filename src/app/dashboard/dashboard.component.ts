import {Component, OnInit} from '@angular/core'
import { AuvService } from '../auv/auv.service';
import  { MouseEvent, LatLng } from 'angular2-google-maps/core';
import { Trip, Waypoint} from '../trip/trip';
import { TripService } from '../trip/trip.service';
import {  } from 'angular2-google-maps/core';

var MANUAL = 'manual';
var GOTO_POINT = 'goto';
var TRIP = 'trip';


@Component({
  selector: 'dashboard',
  styleUrls: ['./dashboard.css'],
  templateUrl: './dashboard.html',
  providers: [TripService]
})
export class DashboardComponent implements OnInit {

  circleRadius: number
  zoom: number = 12
  lat: number = 49.2827
  lng: number = -123.1207
  targetWaypoint: Waypoint
  currentPosition: any;
  controlMode: string = 'manual'
  trips: Trip[]
  selectedTrip: Trip

  constructor(private auv: AuvService, 
              private tripService: TripService) { }

  ngOnInit() {
    this.onZoomChange(this.zoom);
    this.getCurrentPosition();
    this.targetWaypoint = {lat: this.lat, lng: this.lng} as Waypoint;
  }

  getActiveTrip() {
    if (this.auv.selectedAuv) {
      return this.auv.selectedAuv.active_trip;
    }
  }
  
  waypointDragEnd($event: MouseEvent) {
      this.targetWaypoint.lat = $event.coords.lat;
      this.targetWaypoint.lng = $event.coords.lng;
  }

  moveToWaypoint(event: MouseEvent) {
    console.log(this.targetWaypoint);
    this.auv.moveToWaypoint(this.targetWaypoint.lat, this.targetWaypoint.lng);
  }

  turnRight(event) {
    console.log(event);
    this.auv.turnRight();
  };

  turnLeft(event) {
    console.log(event);
    this.auv.turnLeft();
  }

  moveForward(event) {
    console.log(event);
    this.auv.moveForward();
  }

  stop(event) {
    console.log(event);
    this.auv.stop();
  }

  getCurrentPosition() {
    this.currentPosition = { lat: this.lat, lng: this.lng }
  }

  onZoomChange(zoom) {
    /* calculate meters to pixel conversion 
    *  source: http://stackoverflow.com/questions/9356724/google-map-api-zoom-range
    */
    let metersPerPixel = 156543.03392 * Math.cos(this.lat * Math.PI / 180) / Math.pow(2, zoom)
    let pixelRadius = 15;  // set this to control size of circle on map
    this.circleRadius = pixelRadius * metersPerPixel;  // units of meters
  }

  onCenterChange(latLng: LatLng) {
    // console.log(latLng.lat, latLng.lng);
    this.currentPosition = latLng
  }

}
