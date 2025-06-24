import { Component } from '@angular/core';
import { CommonApiService } from 'app/services/commonHttp';
import { TransactionURL } from 'app/services/user/transaction';
import { TRANSACTION_STATUS } from 'app/shared/constant';
import { SelectItem } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-quanlytaichinh',
  templateUrl: './quanlytaichinh.component.html',
  styleUrls: ['./quanlytaichinh.component.scss']
})
export class QuanlytaichinhComponent {
    listTransaction: any;

    sortOptions: SelectItem[];

    sortOrder: number;

    sortField: string;

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
        private http: CommonApiService,
    ) {
    }

    ngOnInit(): void {
        this.sortOptions = [
            {label: 'Gần đây nhất', value: '!createDate'},
            {label: 'Lâu nhất', value: 'createDate'}
        ];
        this.loadData()
    }

    loadData() {
        this.http
        .get(
            TransactionURL.getAllTransactionByAdmin()
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
