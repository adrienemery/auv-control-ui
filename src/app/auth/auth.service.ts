import { Injectable }      from '@angular/core';
import {Http, Headers} from "@angular/http";

import 'rxjs/add/operator/toPromise';


@Injectable()
export class AuthService {
    constructor(private http: Http) {
    }

    private authUrl = 'http://localhost:8000/api/auth/login/';
    

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

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    authenticated() {
        // Check if there's an unexpired JWT
        // It searches for an item in localStorage with key == 'id_token'
        if (localStorage.getItem('token') !== null) {
            return true;
        } else {
            return false;
        }
    };

    logout() {
        // Remove token from localStorage
        localStorage.removeItem('token');
    };

    getToken(): string {
        return localStorage.getItem('token');  // TODO use local storage
    };
}