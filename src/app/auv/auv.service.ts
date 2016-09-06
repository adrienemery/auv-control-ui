import { Component, Injectable, OnInit} from '@angular/core';
import { AuthService } from '../auth/auth.service';
import {Http, Headers} from "@angular/http";


// avoid name not found warning
declare var autobahn: any;


@Injectable()
export class AuvService {
    // Handles communication with AUV via crossbar.io and database
    constructor(private auth: AuthService,
                private http: Http) {
    }
    
    connected: boolean = false;
    principal: string = 'frontend'
    crossbar = new autobahn.Connection({
        url: 'ws://127.0.0.1:8080/ws',
        realm: 'realm1',
        // the following attributes must be set for Ticket-based authentication
        //
        authmethods: ["ticket"],
        authid: this.principal,
        onchallenge: (session, method, extra) => {return this.onChallenge(session, method, extra)}
    });

    private onChallenge(session, method, extra) {
        console.log("onchallenge", method, extra);
        if (method === "ticket") {
            return this.auth.getToken();
        } else {
            console.log("don't know how to authenticate using '" + method + "'");
            throw "don't know how to authenticate using '" + method + "'";
        }
    }

    private onClose(reason, details) {
        console.log("disconnected", reason, details.reason, details);
    };

    private onOpen(session) {
        console.log('Connected to WAMP Router');
    };

    connect() {
        this.crossbar.onopen = (session) => {this.onOpen(session)};
        this.crossbar.onclose = (session, detail) => {this.onClose(session, detail)};
        console.log('Opening connection to WAMP router');
        this.crossbar.open();
    };

    createTrip(name, waypoints) {
        // TODO
    };    

    getTrips() {
        // TODO
    };
    
}