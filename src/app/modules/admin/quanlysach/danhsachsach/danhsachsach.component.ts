import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BookURL } from 'app/services/book/book';
import { CommonApiService } from 'app/services/commonHttp';
import { ConfirmationService } from 'app/shared/confirmation.service';
import { BOOK_STATUS_LIST, DEVICE_TYPE, STATUS } from 'app/shared/constant';
import { MessageService } from 'app/shared/message.services';
import { API } from 'environments/environment.prod';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-danhsachsach',
    templateUrl: './danhsachsach.component.html',
    styleUrls: ['./danhsachsach.component.scss']
})
export class DanhsachsachComponent implements OnInit {
    statuses: any[];
    listBook: any[];

    widthOff: number;
    deviceType: string;
    ApiImage: string = API.IMG;

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private _matDialog: MatDialog,
        private http: CommonApiService,
        private router: Router
    ) {

    }

    @HostListener('window:resize', ['$event'])
    onWindowResize() {
        this.onChangeWidthSize()

    }

    ngOnInit(): void {
        this.onChangeWidthSize()
        this.statuses = BOOK_STATUS_LIST
        this.loadData();
    }

    loadData() {
        this.http
        .get(BookURL.getListBookByAdmin())
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((res: any) => {
            if (!res) return;
            this.listBook = res.data;
        });
    }

    onApproveBook(book) {
        const dialogRef = this.confirmationService.showInfoMessage('Xác nhận', 'Xác nhận xét duyệt sách?');

        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe(async (result) => {
            if (result == 'confirmed') {
                this.http.postWithParams(BookURL.approveBook(), { bookId: book.id })
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result) => {
                    if (!result || !result.state) {
                        this.messageService.showErrorMessage(
                            'Lỗi',
                            'Xét duyệt không thành công'
                        );
                    }
                    this.messageService.showSuccessMessage('Thông báo', 'Xét duyệt thành công');
                    this.loadData()
                });
            }
        })
    }

    onBanBook(book) {
        const dialogRef = this.confirmationService.showInfoMessage('Xác nhận', 'Xác nhận chặn sách?');

        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe(async (result) => {
            if (result == 'confirmed') {
                this.http.postWithParams(BookURL.banBook(), { bookId: book.id })
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result) => {
                    if (!result || !result.state) {
                        this.messageService.showErrorMessage(
                            'Lỗi',
                            'Chặn sách không thành công'
                        );
                    }
                    this.messageService.showSuccessMessage('Thông báo', 'Chặn sách thành công');
                    this.loadData()
                });
            }
        })
    }

    onChangeWidthSize() {
        this.widthOff = window.innerWidth;
        if (this.widthOff < 768) {
            this.deviceType = DEVICE_TYPE.MOBILE;
        } else if (this.widthOff < 1024) {
            this.deviceType = DEVICE_TYPE.TABLET
        } else {
            this.deviceType = DEVICE_TYPE.PC;
        }

    }

    getSeverity(status) {
        switch (status) {
            case STATUS.BAN:
                return 'danger';
            case STATUS.DRAFT:
                return 'warning';
            case STATUS.HOAN_THANH:
                return 'success';
            case STATUS.CHUA_HOAN_THANH:
                return 'infor';
            case STATUS.HOAN_THANH:
                return '';
        }
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
