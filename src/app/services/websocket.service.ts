import { Injectable } from '@angular/core';
import { RxStomp } from '@stomp/rx-stomp';
import SockJS from 'sockjs-client';

@Injectable({
    providedIn: 'root',
})
export class WebSocketService extends RxStomp {
    constructor() {
        super();
    }

    public connect() {
        this.configure({
            // We use webSocketFactory for SockJS support to match backend .withSockJS()
            webSocketFactory: () => new SockJS('http://localhost:8080/api/ws'),
            debug: (msg: string) => {
                console.log(new Date(), msg);
            },
        });
        this.activate();
    }
}
