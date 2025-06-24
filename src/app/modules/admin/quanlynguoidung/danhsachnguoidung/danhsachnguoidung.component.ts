import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CommonApiService } from 'app/services/commonHttp';
import { UserURL } from 'app/services/user/user';
import { ConfirmationService } from 'app/shared/confirmation.service';
import { DEVICE_TYPE, STATUS } from 'app/shared/constant';
import { MessageService } from 'app/shared/message.services';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-danhsachnguoidung',
  templateUrl: './danhsachnguoidung.component.html',
  styleUrls: ['./danhsachnguoidung.component.scss']
})
export class DanhsachnguoidungComponent {
    statuses: any[];
    listUser: any[];

    widthOff: number;
    deviceType: string;

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
        private confirmationService: ConfirmationService,
        private http: CommonApiService,
        private messageService: MessageService,
    ) {

    }

    @HostListener('window:resize', ['$event'])
    onWindowResize() {
        this.onChangeWidthSize()

    }

    ngOnInit(): void {
        this.onChangeWidthSize()
        this.loadData();
    }

    loadData() {
        this.http
        .get(UserURL.getListUserByAdmin())
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((res: any) => {
            if (!res) return;
            this.listUser = res.data;
        });
    }

    onGrantAdmin(user) {
        const dialogRef = this.confirmationService.showInfoMessage('Xác nhận', 'Xác nhận phân quyền quản lý cho tài khoản?');

        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe(async (result) => {
            if (result == 'confirmed') {
                this.http.postWithParams(UserURL.grantAdmin(), { userId: user.id })
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result) => {
                    if (!result || !result.state) {
                        this.messageService.showErrorMessage(
                            'Lỗi',
                            result.message
                        );
                    }
                    this.messageService.showSuccessMessage('Thông báo', result.message);
                    this.loadData()
                });
            }
        })
    }

    onApproveUser(user) {
        const dialogRef = this.confirmationService.showInfoMessage('Xác nhận', 'Xác nhận bỏ khóa tài khoản?');

        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe(async (result) => {
            if (result == 'confirmed') {
                this.http.postWithParams(UserURL.unbanUser(), { userId: user.id })
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result) => {
                    if (!result || !result.state) {
                        this.messageService.showErrorMessage(
                            'Lỗi',
                            result.message
                        );
                    }
                    this.messageService.showSuccessMessage('Thông báo', result.message);
                    this.loadData()
                });
            }
        })
    }

    onBanUser(user) {
        const dialogRef = this.confirmationService.showInfoMessage('Xác nhận', 'Xác nhận khóa tài khoản?');

        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe(async (result) => {
            if (result == 'confirmed') {
                this.http.postWithParams(UserURL.banUser(), { userId: user.id })
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result) => {
                    if (!result || !result.state) {
                        this.messageService.showErrorMessage(
                            'Lỗi',
                            result.message
                        );
                    }
                    this.messageService.showSuccessMessage('Thông báo', result.message);
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
