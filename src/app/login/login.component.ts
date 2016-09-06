import { Component } from '@angular/core';
import {AuthService} from '../auth/auth.service'


@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    providers: [AuthService]
})
export class LoginComponent {
    constructor(private auth: AuthService) {}
};