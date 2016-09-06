import {Routes} from '@angular/router';

import {DashboardComponent} from './dashboard/dashboard';
import {LoginComponent} from './login/login.component';
import {Trip} from './trip/trip';

export const rootRouterConfig: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  { path: 'login', component: LoginComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'trip', component: Trip},
];

