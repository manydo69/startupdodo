import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
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
export class DanhsachsachComponent implements OnInit, OnDestroy {
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
        .get(BookURL.getAllByAuthorId())
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((res: any) => {
            if (!res) return;
            this.listBook = res.data;
        });
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

    onRowDelete(book) {
        const dialogRef = this.confirmationService.showWarningMessage('Xác nhận', 'Bạn có muốn xóa sách không?');

        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe((result) => {
            if (result == 'confirmed') {
                this.http
                .delete(BookURL.delete(book.id))
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((res: any) => {
                    if (!res || !res.state)
                        return;
                    this.messageService.showSuccessMessage('Thông báo', 'Xóa sách thành công');
                    this.loadData();
                });
            } else {

            }
        });
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
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
