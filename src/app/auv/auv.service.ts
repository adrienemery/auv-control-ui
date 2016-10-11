import { Component, Injectable, OnInit} from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { AuthHttp } from '../auth/auth-http.service';
import { Auv } from './auv';


interface Waypoint {
    lat: number;
    lng: number;
}

// avoid name not found warning since autobahn is included in `index.html`
declare var autobahn: any;

interface AuvData {
    lat: number;
    lng: number;
    heading: number;
    mode: string;
    speed: number;
    left_motor_speed: number;
    right_motor_speed: number;
    target_waypoint: Waypoint
    timestamp: Date
}

@Injectable()
export class AuvService {
    // Handles communication with AUV via crossbar.io and database
    // TODO move crossbar.io connection logic into its own service
    constructor(private auth: AuthService,
                private http: AuthHttp) {
    }
    
    speed = 0.0;
    lat = 49.1131;
    lng = -121.4243;
    heading = 180;
    lastSeen: number = 0;
    connected: boolean = false;
    principal: string = 'frontend'
    session: any
    selectedAuv: Auv;
    crossbar = new autobahn.Connection({
        url: 'ws://127.0.0.1:8080/ws',
        realm: 'realm1',
        // the following attributes must be set for Ticket-based authentication
        authmethods: ["ticket"],
        authid: this.principal,
        onchallenge: (session, method, extra) => {return this.onChallenge(session, method, extra)}
    });

    // handle authentication challenge from crossbar router
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

    // handle crossbar connection closed
    private onClose(reason, details) {
        this.connected = false;
        console.log("disconnected", reason, details.reason, details);
    };

    // handle heartbeat from Auv
    private onHeartbeat (data) {
        this.connected = true;
        this.lastSeen = Date.now();
        console.log("onHeartbeat() event received with data:" + data);
    };

    // handle new data updated from Auv
    private onUpdate (data) {
        this.connected = true;
        this.lastSeen = Date.now();
        console.log("onUpdate() event received");
        console.log(data[0]);
        let auvData = data[0] as AuvData 
        this.lat = auvData.lat
        this.lng = auvData.lng
        // this.targetWaypoint = auvData.target_waypoint
        this.heading = auvData.heading
        this.speed = auvData.speed
    };

    // handle crossbar client leaving network
    private onLeave (session, kwargs) {
        console.log(session);
        console.log(kwargs);
    }

    // handle crossbar client joining network
    private onJoin (session, kwargs) {
        console.log(session);
        console.log(kwargs);
    }

    /* handle succesful join to crossbar router
    *
    *  Subscribe to topics and register RPC's
    */ 
    private onOpen(session, details) {
        this.session = session
        console.log('Connected to WAMP Router');
        console.log("connected session with ID " + session.id);
        console.log("authenticated using method '" + details.authmethod + "' and provider '" + details.authprovider + "'");
        console.log("authenticated with authid '" + details.authid + "' and authrole '" + details.authrole + "'");
        
        // subscribe to auv heartbeat so we know it's still alive
        session.subscribe('com.auv.update', (data) => {this.onUpdate(data)}).then(
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

    moveToWaypoint(lat, lng) {
        this.session.call('com.auv.move_to_waypoint', [lat, lng]).then(
            function (res) {
                console.log("move_to_waypoint() result:", res);
            },
            function (err) {
                console.log("move_to_waypoint() error:", err);
            }
        ); 
    }

    moveForward() {
       console.log('moveForward');
        this.session.call('com.auv.move_forward').then(
            function (res) {
                console.log("move_forward() result:", res);
            },
            function (err) {
                console.log("move_forward() error:", err);
            }
        ); 
    }

    turnRight(): void {
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
        console.log('stop');
        this.session.call('com.auv.stop').then(
            function (res) {
                console.log("stop() result:", res);
            },
            function (err) {
                console.log("stop() error:", err);
            }
        );
    }

    getAuvListUrl() {
        return 'api/auvs/' 
    }

    getAuvDetailUrl(auv: Auv) {
        return 'api/auvs/' + auv.id + '/'
    }

    getAuvs(): Promise<Auv[]>  {
        return this.http.get(this.getAuvListUrl())
                         .toPromise()
                         .then(response => response.json() as Auv[])
                         .catch(error => console.log(error));
    }

    createAuv(auv: Auv): Promise<Auv> {
        return this.http.post(this.getAuvListUrl(), JSON.stringify(auv))
                        .toPromise()
                        .then(response => response.json() as Auv) 
                        .catch(error => console.log(error));
    }

    updateAuv(auv: Auv): Promise<Auv> {
        return this.http.patch(this.getAuvDetailUrl(auv), JSON.stringify(auv))
                        .toPromise()
                        .then(response => response.json() as Auv)
                        .catch(error => console.log(error));
    }

    deleteAuv(auv: Auv) {
        return this.http.delete(this.getAuvDetailUrl(auv))
                        .toPromise()
                        .then(response => response)
                        .catch(error => console.log(error));
    }
    
}