import { Component, OnInit } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { MessageService } from './shared/message.services';
import { DeviceDetectorService } from 'ngx-device-detector';
import { BehaviorSubject, ReplaySubject, Subject, takeUntil } from 'rxjs';
import { AppState } from './ngxstore/state/app.state';
import { Store } from '@ngrx/store';
import { APP_ACTION } from './ngxstore/actions/app.actions';
import { CommonApiService } from './services/commonHttp';
import { NotifyURL } from './services/user/notification';
import { NotificationService } from './shared/notification.service';
import { ShareData } from './shared/shareservice.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    messages: any[] = [];
    // message: any;


    firebaseToken: string;
    deviceInfo: any;

    user: any;
    user$ = new BehaviorSubject<any>({});

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    /**
     * Constructor
     */
    constructor(
        private msg: AngularFireMessaging,
        private messageService: MessageService,
        private deviceService: DeviceDetectorService,
        private store: Store<AppState>,
        private http: CommonApiService,
        private notificationService: NotificationService,
        private shareData: ShareData,
    ) {
        const appUser = this.store.select((state) => state.appUser);
        appUser.subscribe((res: any) => {
            const data = res;
            if (data && data.type === APP_ACTION.USER_INFO) {
                this.user = { ...data.payload };
                this.user$.next(this.user);
            }
        });
    }
    ngOnInit(): void {
        this.notificationService.pushNotifyToken$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((response: string) => {
                if (!response) return;
                this.firebaseToken = response;
                this.saveNotifyToken();
            });
        this.notificationService.message$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((response: any) => {
                if(!response) return;
                this.messageService.showInfoMessage(response.title, response.body)
            });
        this.deviceInfo = this.deviceService.getDeviceInfo();
        this.shareData.sendMessage("DEVICE_INFO", this.deviceInfo)
        this.notificationService.registerNotifyToken();
        this.notificationService.listenNotify();

    }

    saveNotifyToken() {
        if (this.user) {
            this.http.postWithParams(NotifyURL.saveNotificationToken(), { token: this.firebaseToken, device: this.deviceInfo.deviceType })
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result) => {

                });
        }
    }

}
