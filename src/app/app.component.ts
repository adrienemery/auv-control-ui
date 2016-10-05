import {Component, OnInit} from '@angular/core';
import { AuthService } from './auth/auth.service';
import { AuvService } from './auv/auv.service';
import { Auv } from './auv/auv';


@Component({
  selector   : 'app',
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  providers: []
})
export class AppComponent implements OnInit {
  
  constructor(private auth: AuthService,
              private auvService: AuvService) {
  }

  title: string = 'My Map';
  lat: number = 49.2827;
  lng: number = -123.1207;
  zoom: number = 8;
  auvConnected: boolean = false;

  ngOnInit() {
    this.auvService.connect();
    this.auvService.getAuvs()
                   .then(auvs => {
                     this.auvService.selectedAuv = auvs[0];
                     console.log(this.auvService.selectedAuv);
                   });
    this.checkAuvConnected();
  };

  checkAuvConnected() {
    if (this.auvService.connected && (Date.now() - this.auvService.lastSeen) < 5000) {
      this.auvConnected = true;
    } else {
      this.auvConnected = false;
    }
    // call ourself every 1 second
    setTimeout(() => this.checkAuvConnected(), 1000);
  }

  lastSeen() {
    var date = new Date(Date.now() - this.auvService.lastSeen);
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
