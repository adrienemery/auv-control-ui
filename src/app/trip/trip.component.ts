import {Component, OnInit} from '@angular/core';


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

    ngOnInit() {
        this.newTrip();
    }
    
    newTrip() {
        // create a new trip and add it to the trips array
        this.selectedTrip = new Trip();
        this.trips.push(this.selectedTrip);
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
