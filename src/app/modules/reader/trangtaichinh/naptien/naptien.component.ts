import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { UserService } from 'app/core/user/user.service';
import { GOLD_EXCHANGE } from 'app/model/goldExchange';
import { APP_ACTION } from 'app/ngxstore/actions/app.actions';
import { AppState } from 'app/ngxstore/state/app.state';
import { CommonApiService } from 'app/services/commonHttp';
import { TransactionURL } from 'app/services/user/transaction';
import { UserURL } from 'app/services/user/user';
import { ConfirmationService } from 'app/shared/confirmation.service';
import { BANK } from 'app/shared/constant';
import { CurrentUserService } from 'app/shared/currentUser.service';
import { MessageService } from 'app/shared/message.services';
import { ShareData } from 'app/shared/shareservice.service';
import { API } from 'environments/environment.prod';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-naptien',
  templateUrl: './naptien.component.html',
  styleUrls: ['./naptien.component.scss']
})
export class NaptienComponent implements OnInit, OnDestroy{
    dataShow
    model
    ipV4Address
    amount = 0

    point = 0

    goldExchange: GOLD_EXCHANGE;
    listBank: any[]=[]

    user$ = new BehaviorSubject<any>({});
    user: any
    ApiImage: string = API.IMG;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
        private http: CommonApiService,
        private messageService: MessageService,
        private _httpClient: HttpClient,
        private store: Store<AppState>,
        private confirmationService: ConfirmationService,
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
        this.goldExchange = {}
        this.listBank = BANK
        if (this.user) {
            this.loadData()
        } else {

        }
    }

    loadData() {
        const headers = new HttpHeaders();
        headers.set('Content-Type', 'application/json; charset=utf-8');
        this._httpClient.get<{ip:string}>('https://api.ipify.org/?format=json', {headers: headers})
        .subscribe( data => {
          this.ipV4Address = data.ip
          console.log(this.ipV4Address);

        })
        this.http
        .get(
            UserURL.getMyInfo()
        )
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((res: any) => {
            if (!res) return;
            this.dataShow = res.data
        })
    }

    onChargePayment(form) {
        if (form.invalid) {
            this.messageService.showErrorMessage(
                'Lỗi',
                'Vui lòng nhập số tiền muốn nạp.'
            );
            return;
        }
        this.http
        .get(
            TransactionURL.pay('192.168.0.106', this.dataShow.id, this.amount)
        )
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((res: any) => {
            if (!res) return;
            window.open(res.data, '_self');
        })
    }

    onChangePointPayment(formChangePoint) {
        if (formChangePoint.invalid) {
            this.messageService.showErrorMessage(
                'Lỗi',
                'Vui lòng nhập số điểm muốn đổi.'
            );
            return;
        }
        const dialogRef = this.confirmationService.showInfoMessage('Xác nhận', 'Xác nhận đổi điểm?');

        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe(async (result) => {
            if (result == 'confirmed') {
                this.http.postWithParams(TransactionURL.changePoint(), { point: this.point })
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result) => {
                    if (!result || !result.state) {
                        this.messageService.showErrorMessage(
                            'Lỗi',
                            result.message
                        );
                        return
                    }
                    this.messageService.showSuccessMessage('Thông báo', result.message);
                    this.loadData()
                });
            }
        })
    }

    onChangeGoldPayment(formChangeGold) {
        if (formChangeGold.invalid) {
            let message = ''
            if (!this.goldExchange.gold || this.goldExchange.gold <= 0)
                message='Vui lòng nhập số điểm muốn đổi.'
            else if (!this.goldExchange.bankCode)
                message = 'Vui lòng chọn ngân hàng.'
            else if (!this.goldExchange.bankAccount)
                message = 'Vui lòng nhập tài khoản nhận.'
            else {
                message = 'Thông tin không hợp lệ.'
            }
            this.messageService.showErrorMessage(
                'Lỗi',
                message
            );
            return;
        }
        const dialogRef = this.confirmationService.showInfoMessage('Xác nhận', 'Xác nhận đổi điểm?');

        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe(async (result) => {
            if (result == 'confirmed') {
                this.http.post(TransactionURL.changeGold(), this.goldExchange)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result) => {
                    if (!result || !result.state) {
                        this.messageService.showErrorMessage(
                            'Lỗi',
                            result.message
                        );
                        return
                    }
                    this.messageService.showSuccessMessage('Thông báo', result.message);
                });
            }
        })
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
