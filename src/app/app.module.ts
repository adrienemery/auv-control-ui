import {NgModule} from '@angular/core'
import {RouterModule} from "@angular/router";
import {rootRouterConfig} from "./app.routes";
import {AppComponent} from "./app";
import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {HttpModule} from "@angular/http";
import {Trip} from './trip/trip';
import {Dashboard} from './dashboard/dashboard';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';

import { AgmCoreModule } from 'angular2-google-maps/core';


@NgModule({
  declarations: [
    AppComponent, 
    Trip, 
    Dashboard
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
  providers   : [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap   : [AppComponent]
})
export class AppModule {

}