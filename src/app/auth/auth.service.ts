import { Injectable }      from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import {Http, Headers} from "@angular/http";



@Injectable()
export class AuthService {
    constructor(private http: Http) {
    }

    private _authenticated: boolean = true;

    login(event, username, password) {
      console.log('logging in...');
    }

    authenticated() {
        // Check if there's an unexpired JWT
        // It searches for an item in localStorage with key == 'id_token'
        return this._authenticated;
    };

    logout() {
        // Remove token from localStorage
        this._authenticated = false;
    };

    getToken(): string {
        return 'ad54f74ebfe00a72d53be43c71cccd48c65269cfe39dbe933ec9cc6bea1e7eec';  // TODO use local storage
    };
}