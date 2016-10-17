import {Component, OnInit, Input} from '@angular/core';
import { AuthHttp } from '../auth/auth-http.service';
import { AuvService } from '../auv/auv.service';
import { Auv } from '../auv/auv';
import { Trip, Waypoint } from './trip';
import { TripService } from './trip.service';

import {MouseEvent} from 'angular2-google-maps/core';


@Component({
  selector: 'trip',
  styleUrls: ['./trip.css'],
  templateUrl: './trip.html',
  providers: [TripService]
})
export class TripComponent implements OnInit {
    title: string = 'My Map';
    lat: number = 49.2827;
    lng: number = -123.1207;
    zoom: number = 8;
    trips: Trip[] = [];
    selectedTrip: Trip;
    
    constructor(private http:AuthHttp, 
                private auvService: AuvService,
                private tripService: TripService) { }

    ngOnInit() {
        this.getTrips();
    }

    /*
    * TODO move all these trip API interactions into the trip.service
    */

    getTrips(): void {
        this.tripService.getTrips()
                        .then(trips => {
                            console.log(trips);
                            if (trips) {
                                this.trips = trips;
                                this.selectedTrip = this.trips[0];
                            } else{
                                this.trips = [];
                            }
                        });
    }
    
    // create a new trip and add it to the trips array
    newTrip() {
        this.selectedTrip = new Trip();
        this.trips.push(this.selectedTrip);
    }

    selectTrip(trip: Trip) {
        this.selectedTrip = trip;
    }

    activateTrip() {
        this.selectedTrip.active = true;
        this.saveTrip().then(() => {
            this.auvService.selectedAuv.active_trip = this.selectedTrip;
        }).then(() => this.getTrips())
    }

    // Saving the trip will trigger the database
    // to propagate the changes to the AUV
    // since any state changes made to the database get propogated
    // this ensures that if the AUV is offline, it will still get
    // the update to start the trip the next time it comes online
    startTrip() {
        this.selectedTrip.active = true;
        this.saveTrip();
    }

    saveTrip() {
        if (this.selectedTrip.id) {
            // means we need to patch to update
            return this.tripService.updateTrip(this.selectedTrip)
                                   .then(trip => console.log('Updated Trip: ' + trip))
        } else { 
            // otherwise we need to create a new Trip
            return this.tripService.createTrip(this.selectedTrip)
                                   .then(trip => this.selectedTrip = trip)
        }
        
    }

    deleteTrip() {
        this.tripService.deleteTrip(this.selectedTrip)
                        .then(response => {
                            this.trips.splice(this.trips.indexOf(this.selectedTrip), 1);
                            if (this.trips) {
                                this.selectedTrip = this.trips[0]
                            } else {
                                this.selectedTrip = null;
                            }
                            
                        });       
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
