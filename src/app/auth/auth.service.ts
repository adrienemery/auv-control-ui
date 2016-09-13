import { Injectable } from '@angular/core';
import {Http, Headers} from "@angular/http";

import 'rxjs/add/operator/toPromise';


@Injectable()
export class AuthService {
    // handles logging in/out to auv backend

    constructor(private http: Http) {
    }

    private authUrl = 'http://localhost:8000/api/auth/login/';

    private handleError(error: any): Promise<any> {
        // remove token from localstorage if we get a 403 error
        // and force user to login again
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

    login(username, password): Promise<any> {
        console.log('logging in...');
        var headers = new Headers({'Content-Type': 'application/json',
                                   'Authorization': 'Basic ' + btoa(username + ':' + password)});
        console.log(headers);                                   

        return this.http.post(this.authUrl, {}, {headers: headers})
                   .toPromise()
                   .then(response => localStorage.setItem('token', response.json().token))
                   .catch(this.handleError);
    }

    logout() {
        // Remove token from localStorage
        localStorage.removeItem('token');
    };

    authenticated() {
        // if there is a token in localstorage we return true
        if (localStorage.getItem('token') !== null) {
            return true;
        } else {
            return false;
        }
    };

    getToken(): string {
        return localStorage.getItem('token');
    };

    

}