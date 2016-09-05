import {Routes} from '@angular/router';
import {Trip} from './trip/trip';
import {Dashboard} from './dashboard/dashboard';

export const rootRouterConfig: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'dashboard', component: Dashboard},
  {path: 'trip', component: Trip},
];

