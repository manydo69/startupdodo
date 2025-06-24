import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { CommonApiService } from 'app/services/commonHttp';
import { NotifyURL } from 'app/services/user/notification';
import { ShareData } from 'app/shared/shareservice.service';
import {
    BehaviorSubject,
    Observable,
    ReplaySubject,
    Subject,
    takeUntil,
} from 'rxjs';
import { MessageService } from './message.services';
import { DeviceDetectorService } from 'ngx-device-detector';

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    pushNotifyToken: ReplaySubject<string> = new ReplaySubject<string>();
    message: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    currentToken: string;
    deviceInfo;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
        private msg: AngularFireMessaging,
        private sharedData: ShareData,
        private http: CommonApiService,
        private messageService: MessageService,
        private deviceService: DeviceDetectorService
    ) {
        this.deviceInfo = this.deviceService.getDeviceInfo();
    }

    get pushNotifyToken$(): Observable<string> {
        return this.pushNotifyToken.asObservable();
    }

    get message$(): Observable<any> {
        return this.message.asObservable();
    }

    get currentToken$(): string {
        return this.currentToken;
    }

    registerNotifyToken() {
        this.msg.requestPermission.subscribe(
            () => {
              console.log('Permission granted!');
              // Handle successful permission grant
              this.msg.requestToken.subscribe({
                next: (currentToken) => {
                    this.saveNotifyToken(currentToken, this.deviceInfo);
                    this.currentToken = currentToken;
                    this.pushNotifyToken.next(currentToken);
                    console.log("Tokennnnnnnnnn", this.currentToken);

                },
                error: (error) => {
                    console.log(
                        'An error occurred while retrieving token. ',
                        error
                    );
                    console.log(error);
                },
            });
            },
            (error) => {
              console.log('Permission denied:', error);
              // Handle permission denied or error
            }
        );
    }

    listenNotify() {
        this.msg.onMessage((payload) => {
            console.log('aaaaa', payload);

            // Get the data about the notification
            let notification = payload.notification;

            // Create a Message object and add it to the array
            this.message.next(notification);
        });
    }

    saveNotifyToken(token, device) {
        this.http
            .postWithParams(NotifyURL.saveNotificationToken(), {
                token: token,
                device: device.deviceType,
            }, false)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result) => {
                if (!result || !result.state) {
                    return;
                }
            });
    }
}
