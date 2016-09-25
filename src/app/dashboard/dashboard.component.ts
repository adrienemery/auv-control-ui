import {Component, OnInit} from '@angular/core'
import { AuvService } from '../auv/auv.service';
import {LatLng} from 'angular2-google-maps/core';
import { Trip } from '../trip/trip';

var MANUAL = 'manual';
var GOTO_POINT = 'goto';
var TRIP = 'trip';


@Component({
  selector: 'dashboard',
  styleUrls: ['./dashboard.css'],
  templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {

  circleRadius: number
  zoom: number = 8
  lat: number = 49.2827
  lng: number = -123.1207
  currentPosition: any;
  controlMode: string = 'manual'

  constructor(private auv: AuvService) { }

  ngOnInit() {
    this.onZoomChange(this.zoom);
    this.getCurrentPosition();
  }

  getActiveTrip() {
    if (this.auv.selectedAuv) {
      return this.auv.selectedAuv.active_trip;
    }
  }

  turnRight(event) {
    console.log(event);
    this.auv.turnRight();
  };

  turnLeft(event) {
    console.log(event);
    this.auv.turnLeft();
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
