import { Injectable, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { AuthHttp } from '../auth/auth-http.service';
import { AuvService } from '../auv/auv.service';
import { Auv } from '../auv/auv';
import { Trip, Waypoint } from './trip';


@Injectable()
export class TripService {
    
    constructor(private http:AuthHttp, 
                private auvService: AuvService) { 
    }

    getTripDetailUrl(trip: Trip) {
        // Note: the trailing slash is required
        return this.getTripListUrl() + trip.id + '/'
    }

    getTripListUrl() {
        return 'api/auvs/' + this.auvService.selectedAuv.id + '/trips/';
    }
    
    getTrips(): Promise<Trip[]>  {
        // console.log(this.getTripListUrl());
        return this.http.get(this.getTripListUrl())
                         .toPromise()
                         .then(response => response.json() as Trip[])
                         .catch(error => console.log(error));
    }

    createTrip(trip: Trip): Promise<Trip> {
        return this.http.post(this.getTripListUrl(), JSON.stringify(trip))
                        .toPromise()
                        .then(response => response.json() as Trip) 
                        .catch(error => console.log(error));
    }

    updateTrip(trip: Trip): Promise<Trip> {
        return this.http.patch(this.getTripDetailUrl(trip), JSON.stringify(trip))
                        .toPromise()
                        .then(response => response.json() as Trip)
                        .catch(error => console.log(error));
    }

    deleteTrip(trip: Trip) {
        return this.http.delete(this.getTripDetailUrl(trip))
                        .toPromise()
                        .then(response => response)
                        .catch(error => console.log(error));
    }
    
}
