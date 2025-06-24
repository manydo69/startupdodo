import { HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { APP_ACTION } from 'app/ngxstore/actions/app.actions';
import { AppState } from 'app/ngxstore/state/app.state';
import { CommonApiService } from 'app/services/commonHttp';
import { TopicURL } from 'app/services/topic/topic';
import { UserURL } from 'app/services/user/user';
import { ConfirmationService } from 'app/shared/confirmation.service';
import { MessageService } from 'app/shared/message.services';
import { API } from 'environments/environment.prod';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-chudetheodoi',
    templateUrl: './chudetheodoi.component.html',
    styleUrls: ['./chudetheodoi.component.scss'],
})
export class ChudetheodoiComponent implements OnInit {
    is_currentUserInfo: boolean = false;
    dataShow: any;
    user$ = new BehaviorSubject<any>({});
    user: any;

    // listTopic: any[];
    listTopicFollow: any[];
    listTopicNotFollow: any[];

    ApiImage: string = API.IMG;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
        private http: CommonApiService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private store: Store<AppState>,
        private _changeDetectorRef: ChangeDetectorRef
    ) {
        const appUser = this.store.select((state) => state.appUser);
        appUser.subscribe((res: any) => {
            const data = res;
            if (data && data.type === APP_ACTION.USER_INFO) {
                this.user = { ...data.payload };
                console.log(this.user);

                this.user$.next(this.user);
                setInterval(() => {
                    this._changeDetectorRef.detectChanges();
                }, 500);
            }
        });
    }

    ngOnInit() {
        if (this.user) {
            this.loadData()
        } else {
        }
    }

    loadData(){
        this.http
            .get(TopicURL.getListTopicFollow())
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res: any) => {
                this.listTopicFollow = res.data;
            });
            this.http
            .get(TopicURL.getListTopicNotFollow())
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res: any) => {
                this.listTopicNotFollow = res.data;
            });
    }

    onFollowTopic(topic) {
        let topicIds = topic.map(item => item.id);
        let params = new HttpParams();
        if (topic && topic.length > 0) {
            params = params.set('topicIds', topicIds.join(','))
            console.log(params);

        } else {
            return
        }
        this.http.postWithParams(TopicURL.followTopic(), params)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((result) => {
            if (!result || !result.state) {
                this.messageService.showErrorMessage(
                    'Lỗi',
                    'Theo dõi không thành công'
                );
            }
            this.messageService.showSuccessMessage('Thông báo', result.message);
            // this.loadData()
        });
    }

    onUnFollowTopic(topic) {
        let topicIds = topic.map(item => item.id);
        let params = new HttpParams();
        if (topic && topic.length > 0) {
            params = params.set('topicIds', topicIds.join(','))
        } else {
            return
        }
        this.http.postWithParams(TopicURL.unFollowTopic(), params)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((result) => {
            if (!result || !result.state) {
                this.messageService.showErrorMessage(
                    'Lỗi',
                    'Bỏ theo dõi không thành công'
                );
            }
            this.messageService.showSuccessMessage('Thông báo', result.message);
            // this.loadData()
        });
    }
    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
