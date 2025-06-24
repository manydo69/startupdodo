import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserService } from 'app/core/user/user.service';
import { APP_ACTION } from 'app/ngxstore/actions/app.actions';
import { AppState } from 'app/ngxstore/state/app.state';
import { CommonApiService } from 'app/services/commonHttp';
import { TransactionURL } from 'app/services/user/transaction';
import { UserURL } from 'app/services/user/user';
import { TRANSACTION_STATUS } from 'app/shared/constant';
import { MessageService } from 'app/shared/message.services';
import { API } from 'environments/environment.prod';
import { SelectItem } from 'primeng/api';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-lichsu',
  templateUrl: './lichsu.component.html',
  styleUrls: ['./lichsu.component.scss']
})
export class LichsuComponent {
    dataShow: any;
    listTransaction: any;

    sortOptions: SelectItem[];

    sortOrder: number;

    sortField: string;

    user$ = new BehaviorSubject<any>({});
    user: any
    ApiImage: string = API.IMG;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
        private http: CommonApiService,
        private messageService: MessageService,
        private _userService: UserService,
        private store: Store<AppState>
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
        this.sortOptions = [
            {label: 'Gần đây nhất', value: '!createDate'},
            {label: 'Lâu nhất', value: 'createDate'}
        ];
        if (this.user) {
            this.loadData()
        } else {

        }
    }

    loadData() {
        this.http
        .get(
            UserURL.getMyInfo()
        )
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((res: any) => {
            if (!res) return;
            this.dataShow = res.data
        })
        this.http
        .get(
            TransactionURL.getMyTransaction()
        )
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((res: any) => {
            if (!res) return;
            this.listTransaction = res.data
        })
    }

    getSeverity (status: any) {
        switch (status) {
            case TRANSACTION_STATUS.THANHCONG:
                return 'success';

            case TRANSACTION_STATUS.THATBAI:
                return 'danger';

            default:
                return null;
        }
    };

    onSortChange(event) {
        let value = event.value;

        if (value.indexOf('!') === 0) {
            this.sortOrder = -1;
            this.sortField = value.substring(1, value.length);
        }
        else {
            this.sortOrder = 1;
            this.sortField = value;
        }
    }

}
