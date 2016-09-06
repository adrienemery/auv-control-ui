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
    };

    private onClose(reason, details) {
        this.connected = false;
        console.log("disconnected", reason, details.reason, details);
    };

    private onHeartbeat (data) {
        this.connected = true;
        console.log("onHeartbeat() event received with data:" + data);
    };

    private onOpen(session, details) {
        console.log('Connected to WAMP Router');
        console.log("connected session with ID " + session.id);
        console.log("authenticated using method '" + details.authmethod + "' and provider '" + details.authprovider + "'");
        console.log("authenticated with authid '" + details.authid + "' and authrole '" + details.authrole + "'");

        session.subscribe('com.auv.heartbeat', (data) => {this.onHeartbeat(data)}).then(
            function (sub) {
                console.log('subscribed to topic');
            },
            function (err) {
                console.log('failed to subscribe to topic', err);
            }
        );
    };

    connect() {
        // Note we need to use lamba functions here
        // to ensure the correct `this` is set when calling these functions
        this.crossbar.onopen = (session, details) => {this.onOpen(session, details)};
        this.crossbar.onclose = (session, details) => {this.onClose(session, details)};
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