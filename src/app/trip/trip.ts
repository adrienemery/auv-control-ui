import {Component} from '@angular/core';


@Component({
  selector: 'trip',
  styleUrls: ['./trip.css'],
  templateUrl: './trip.html'
})
export class Trip {
  title: string = 'My Map';
  lat: number = 49.2827;
  lng: number = -123.1207;
  zoom: number = 8;
}
