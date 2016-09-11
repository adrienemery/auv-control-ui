import {Component, OnInit} from '@angular/core';
import { AuthService } from './auth/auth.service';
import { AuvService } from './auv/auv.service';


@Component({
  selector   : 'app',
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  providers: []
})
export class AppComponent implements OnInit {
  
  constructor(private auth: AuthService,
              private auv: AuvService) {
  }

  title: string = 'My Map';
  lat: number = 49.2827;
  lng: number = -123.1207;
  zoom: number = 8;

  ngOnInit() {
    this.auv.connect();
  };

  auvConnected() {
    if (this.auv.connected && Date.now() - this.auv.lastSeen < 5000) {
      return true;
    } else {
      return false;
    }
  };

  lastSeen() {
    var date = new Date(Date.now() - this.auv.lastSeen);
    // Hours part from the timestamp
    var hours = date.getHours();
    // Minutes part from the timestamp
    var minutes = date.getMinutes();
    // Seconds part from the timestamp
    var seconds = date.getSeconds();

    if (minutes > 0) {
      return minutes.toString() + ' minutes';
    } else {
      return seconds.toString() + ' seconds';
    }
  };

}
