import {Component, OnInit} from '@angular/core';
import { AuthService } from './auth/auth.service';
import { AuvService } from './auv/auv.service';


@Component({
  selector   : 'app',
  templateUrl: './app.html',
  providers: [AuthService, AuvService]
})
export class AppComponent implements OnInit {
  
  constructor(private auth: AuthService,
              private auv: AuvService) {
  }

  ngOnInit() {
    this.auv.connect()
  }

  auvConnected() {
    return this.auv.connected;
  }

  loggedIn() {
    return this.auth.authenticated;
  }
}
