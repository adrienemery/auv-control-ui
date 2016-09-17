import {Component, OnInit, Input} from '@angular/core';
import { AuthHttp } from '../auth/auth-http.service';
import { AuvService } from '../auv/auv.service';
import { Auv } from '../auv/auv';
import {MouseEvent} from 'angular2-google-maps/core';


// just an interface for type safety.
interface Waypoint {
	lat: number;
	lng: number;
    order?: number;
	label?: string;
	draggable?: boolean;
}


export class Trip {
  id: number;
  name: string;
  waypoints: Waypoint[] = [];

  constructor() {
      this.name = 'New Trip';
  }
}


@Component({
  selector: 'trip',
  styleUrls: ['./trip.css'],
  templateUrl: './trip.html'
})
export class TripComponent implements OnInit {
    title: string = 'My Map';
    lat: number = 49.2827;
    lng: number = -123.1207;
    zoom: number = 8;
    trips: Trip[] = [];
    selectedTrip: Trip;
    
    constructor(private http:AuthHttp, private auvService: AuvService) { }

    ngOnInit() {
        this.getTrips();
        console.log(this.auvService.selectedAuv);
    }

    /*
    * TODO move all these trip API interactions into the trip.service
    */

    getTrips() {
        this.http.get(this.getTripListUrl())
                 .toPromise()
                 .then(response => {
                    this.trips = response.json();
                    if (this.trips) {
                        this.selectedTrip = this.trips[0];
                    }
                 })
    }
    
    newTrip() {
        // create a new trip and add it to the trips array
        this.selectedTrip = new Trip();
        this.trips.push(this.selectedTrip);
    }

    selectTrip(trip: Trip) {
        this.selectedTrip = trip;
    }

    getTripDetailUrl() {
        // Note: the trailing slash is required
        return this.getTripListUrl() + this.selectedTrip.id + '/'
    }

    getTripListUrl() {
        return 'api/auvs/' + this.auvService.selectedAuv.id + '/trips/';
    }

    saveTrip() {
        if (this.selectedTrip.id) {
            // means we need to patch to update
            this.http.patch(this.getTripDetailUrl(), JSON.stringify(this.selectedTrip))
                     .toPromise()
                     .then(response => console.log(response.json()))
        } else { 
            // otherwise we need to create a new Trip
            this.http.post(this.getTripListUrl(), JSON.stringify(this.selectedTrip))
                     .toPromise()
                     .then(response => console.log(response.json()))
        }
        
    }

    deleteTrip() {
        this.http.delete(this.getTripDetailUrl())
                 .toPromise()
                 .then(response => console.log(response.json()))
    }

    addWaypoint($event: MouseEvent) {
        console.log($event);
        var waypoint: Waypoint = {
            lat: $event.coords.lat,
            lng: $event.coords.lng,
            draggable: true,
        }
        var index = this.selectedTrip.waypoints.push(waypoint);
        waypoint.order = index;
    }

    removeWaypoint(index: number) {
        this.selectedTrip.waypoints.splice(index, 1);
        // update labels for each waypoint
        this.selectedTrip.waypoints.forEach((waypoint: Waypoint, index: number, array: Waypoint[]) => {
            // offset index by one to keep labels 1-indexed
            waypoint.order = (index + 1);
        });
    }

    clickedMarker(index: number) {
        console.log(`clicked the marker: ${index}`)
    }
    
    waypointDragEnd(waypoint: Waypoint, $event: MouseEvent) {
        waypoint.lat = $event.coords.lat;
        waypoint.lng = $event.coords.lng;
        console.log(waypoint);
    }
}
