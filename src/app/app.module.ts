import {NgModule} from '@angular/core'
import {RouterModule} from "@angular/router";

import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {HttpModule} from "@angular/http";

import {rootRouterConfig} from "./app.routes";
import {AppComponent} from "./app.component";

import { LoginComponent } from './login/login.component';
import {Trip} from './trip/trip';
import {DashboardComponent} from './dashboard/dashboard';
import {AuthService} from './auth/auth.service';
import {AuvService} from './auv/auv.service';

import {AgmCoreModule} from 'angular2-google-maps/core';


@NgModule({
  imports: [
    BrowserModule, 
    FormsModule, 
    HttpModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDsR9YTzWEMaDQTj818Tv_FDCAZr1_vkPM'
    }),
    RouterModule.forRoot(rootRouterConfig),
  ],
  providers: [
    AuthService, 
    AuvService
  ],
  declarations: [
    AppComponent, 
    LoginComponent,
    Trip, 
    DashboardComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
