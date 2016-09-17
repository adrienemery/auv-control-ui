import { Component, Injectable, OnInit} from '@angular/core';
import { AuthService } from '../auth/auth.service';
import {Http, Headers} from "@angular/http";
import { Auv } from './auv';


// avoid name not found warning since autobahn is included in `index.html`
declare var autobahn: any;


@Injectable()
export class AuvService {
    // Handles communication with AUV via crossbar.io and database
    // TODO move crossbar.io connection logic into its own service
    constructor(private auth: AuthService,
                private http: Http) {
    }
    
    speed = 0.3;
    lat = 49.1131;
    lng = -121.4243;
    heading = 125.0;
    lastSeen: number = 0;
    connected: boolean = false;
    principal: string = 'frontend'
    session: any
    selectedAuv: Auv = {id: "f00a7a7b-44cd-4a5f-b424-a15037ccece8"};  // TODO get this from database
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
        if (this.auth.authenticated()) {
            if (method === "ticket") {
                return this.auth.getToken();
            } else {
                console.log("don't know how to authenticate using '" + method + "'");
                throw "don't know how to authenticate using '" + method + "'";
            }
        } else {
            console.log('You are not logged in!');
        }
    };

    private onClose(reason, details) {
        this.connected = false;
        console.log("disconnected", reason, details.reason, details);
    };

    private onHeartbeat (data) {
        this.connected = true;
        this.lastSeen = Date.now();
        console.log("onHeartbeat() event received with data:" + data);
    };

    private onLeave (session, kwargs) {
        console.log(session);
        console.log(kwargs);
    }

    private onJoin (session, kwargs) {
        console.log(session);
        console.log(kwargs);
    }

    private onOpen(session, details) {
        this.session = session
        console.log('Connected to WAMP Router');
        console.log("connected session with ID " + session.id);
        console.log("authenticated using method '" + details.authmethod + "' and provider '" + details.authprovider + "'");
        console.log("authenticated with authid '" + details.authid + "' and authrole '" + details.authrole + "'");
        
        // subscribe to auv heartbeat so we know it's still alive
        session.subscribe('com.auv.heartbeat', (data) => {this.onHeartbeat(data)}).then(
            function (sub) {
                console.log('subscribed to topic' + sub);
            },
            function (err) {
                console.log('failed to subscribe to topic', err);
            }
        );

        // subscribe to `on_leave` topic so we can be notified if the auv drops offline
        session.subscribe('wamp.session.on_leave', (session, kwargs) => {this.onLeave(session, kwargs)}).then(
            function (sub) {
                console.log('subscribed to topic' + sub);
            },
            function (err) {
                console.log('failed to subscribe to topic', err);
            }
        );

        // subscribe to `on_join` topic so we can be notified if the auv comes online
        session.subscribe('wamp.session.on_join', (session_info, kwargs) => {this.onJoin(session, kwargs)}).then(
            function (sub) {
                console.log('subscribed to topic' + sub);
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

    turnRight(): void {
        // TODO
        console.log('turnRight');
        this.session.call('com.auv.move_right').then(
            function (res) {
                console.log("move_right() result:", res);
            },
            function (err) {
                console.log("move_right() error:", err);
            }
        );
    };

    turnLeft() {
        // TODO
        console.log('turnLeft');
        this.session.call('com.auv.move_left').then(
            function (res) {
                console.log("move_left() result:", res);
            },
            function (err) {
                console.log("move_left() error:", err);
            }
        );
    };

    stop() {
        // TOOD
        console.log('stop');
    }
    
}