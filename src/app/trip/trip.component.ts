import {Component, OnInit} from '@angular/core';
import { AuthHttp } from '../auth/auth-http.service';


// just an interface for type safety.
interface Waypoint {
	lat: number;
	lng: number;
	label?: string;
	draggable?: boolean;
}


export class Trip {
  id: number;
  name: string;
  waypoints: Waypoint[] = [];
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
    tripsUrl: string = 'api/auvs/f00a7a7b-44cd-4a5f-b424-a15037ccece8/trips/'

    constructor(private http:AuthHttp) { }

    ngOnInit() {
        this.newTrip();
        this.getTrips();
    }

    getTrips() {
        this.http.get(this.tripsUrl)
                 .toPromise()
                 .then(response => this.trips = response.json())
    }
    
    newTrip() {
        // create a new trip and add it to the trips array
        this.selectedTrip = new Trip();
        this.trips.push(this.selectedTrip);
    }

    saveTrip() {
        // save the selectedTrip
    }

    addWaypoint($event) {
        console.log($event);
        var waypoint: Waypoint = {
            lat: $event.coords.lat,
            lng: $event.coords.lng,
            draggable: true,
        }
        var index = this.selectedTrip.waypoints.push(waypoint);
        waypoint.label = index.toString();
        
    }

    removeWaypoint(index: number) {
        this.selectedTrip.waypoints.splice(index, 1);
        // update labels for each waypoint
        this.selectedTrip.waypoints.forEach((waypoint: Waypoint, index: number, array: Waypoint[]) => {
            // offset index by one to keep labels 1-indexed
            waypoint.label = (index + 1).toString();
        });
    }

    clickedMarker(label: string, index: number) {
        console.log(`clicked the marker: ${label || index}`)
    }
    
    waypointDragEnd(m: Waypoint, $event: MouseEvent) {
        console.log('dragEnd', m, $event);
    }
}
