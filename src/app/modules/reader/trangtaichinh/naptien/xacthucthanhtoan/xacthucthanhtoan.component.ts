import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonApiService } from 'app/services/commonHttp';
import { TransactionURL } from 'app/services/user/transaction';
import { MessageService } from 'app/shared/message.services';
import { ShareData } from 'app/shared/shareservice.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-xacthucthanhtoan',
  templateUrl: './xacthucthanhtoan.component.html',
  styleUrls: ['./xacthucthanhtoan.component.scss']
})
export class XacthucthanhtoanComponent {
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
            this.createGoldPayment(params);
        })
    }
    createGoldPayment(params: any) {
        let value = params.value;
        let bank = params.bank;
        let account = params.account;
        let token = params.token
        if (account == undefined
          || account == null
          || token == undefined
          || token == null) {
          this._router.navigate(['']);
        }
        this.http
            .postWithParams(TransactionURL.createGoldPayment(), params)
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
