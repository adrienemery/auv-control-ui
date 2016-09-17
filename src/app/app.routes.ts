import {Routes} from '@angular/router';

import {DashboardComponent} from './dashboard/dashboard';
import {LoginComponent} from './login/login.component';
import {TripComponent} from './trip/trip.component';

export const rootRouterConfig: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'trip', component: TripComponent},
];

