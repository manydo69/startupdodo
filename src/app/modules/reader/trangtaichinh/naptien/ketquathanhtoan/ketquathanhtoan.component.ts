import { HttpBackend, HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { CommonApiService } from 'app/services/commonHttp';
import { TransactionURL } from 'app/services/user/transaction';
import { ConfirmationService } from 'app/shared/confirmation.service';
import { TRANSACTION_STATUS, VNPAY_ERROR_CODE } from 'app/shared/constant';
import { CurrentUserService } from 'app/shared/currentUser.service';
import { MessageService } from 'app/shared/message.services';
import { ShareData } from 'app/shared/shareservice.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-ketquathanhtoan',
  templateUrl: './ketquathanhtoan.component.html',
  styleUrls: ['./ketquathanhtoan.component.scss']
})
export class KetquathanhtoanComponent {
    messages
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
        private http: CommonApiService,
        private _activatedroute: ActivatedRoute,
        private messageService: MessageService,
        private _router: Router,
        private shareData: ShareData
    ) {
    }

    ngOnInit(): void {
        this._activatedroute.queryParams.pipe(takeUntil(this._unsubscribeAll))
        .subscribe((params: any) => {
          if (params.vnp_ResponseCode == '00') {
            this.createTransaction(params);
          } else {
            VNPAY_ERROR_CODE.forEach((error: any) => {
              if (error.key === params.vnp_ResponseCode) {
                this.messages = [{ severity: 'error', summary: 'Lỗi', detail: error.message }];
                setTimeout(() => this._router.navigate(['../'], { relativeTo: this._activatedroute }),2500);
              }
            });
          }
        })
    }
    createTransaction(params: any) {
        let amount = params.vnp_Amount;
        let userId = params.vnp_OrderInfo;
        if (amount == undefined
          || amount == null
          || userId == undefined
          || userId == null) {
          this._router.navigate(['']);
        }
        let transaction = {
            cost: amount/100,
            content: `Nạp số tiền ${amount/100} vào tài khoản.`,
            status: TRANSACTION_STATUS.THANHCONG,
            transactionId: params.vnp_BankTranNo,
            bankCode: params.vnp_BankCode,
            cardType: params.vnp_CardType,
        }
        this.http
            .post(TransactionURL.createTransaction(), transaction)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res: any) => {
                if (!res || !res.state){
                    this.messages = [{ severity: 'error', summary: 'Lỗi', detail: 'Giao dịch không thành công' }];
                    setTimeout(() => this._router.navigate(['../'], { relativeTo: this._activatedroute }),2500);

                    return;
                }
                this.messages = [{ severity: 'success', summary: 'Thành công', detail: 'Giao dịch thành công' }];
                setTimeout(() => this._router.navigate(['../'], { relativeTo: this._activatedroute }),2500);
            });
    }
}
