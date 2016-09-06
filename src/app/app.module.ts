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

import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {AgmCoreModule} from 'angular2-google-maps/core';


@NgModule({
  declarations: [
    AppComponent, 
    LoginComponent,
    Trip, 
    DashboardComponent,
  ],
  imports: [
    BrowserModule, 
    FormsModule, 
    HttpModule,
    RouterModule.forRoot(rootRouterConfig),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDsR9YTzWEMaDQTj818Tv_FDCAZr1_vkPM'
    })
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    AuthService, 
    AuvService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
