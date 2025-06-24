import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonApiService } from 'app/services/commonHttp';
import { PostReportURL } from 'app/services/report/postReport';
import { ConfirmationService } from 'app/shared/confirmation.service';
import { DEVICE_TYPE, STATUS } from 'app/shared/constant';
import { MessageService } from 'app/shared/message.services';
import { API } from 'environments/environment.prod';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-baocaobaiviet',
  templateUrl: './baocaobaiviet.component.html',
  styleUrls: ['./baocaobaiviet.component.scss']
})
export class BaocaobaivietComponent implements OnInit {

    listBaoCao: any[];

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
        this.loadData();
    }

    loadData() {
        this.http
            .get(PostReportURL.getListByAdmin())
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res: any) => {
                if (!res) return;
                this.listBaoCao = res.data;
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

    onApproveReport(report) {
        const dialogRef = this.confirmationService.showInfoMessage('Xác nhận', 'Xác nhận xét duyệt báo cáo?');

        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe(async (result) => {
            if (result == 'confirmed') {
                this.http.postWithParams(PostReportURL.approveReport(), { reportId: report.id })
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result) => {
                    if (!result || !result.state) {
                        this.messageService.showErrorMessage(
                            'Lỗi',
                            result.message
                        );
                    }
                    this.messageService.showSuccessMessage('Thông báo', 'Xét duyệt thành công');
                    this.loadData()
                });
            }
        })
    }

    onRefuseReport(report) {
        const dialogRef = this.confirmationService.showInfoMessage('Xác nhận', 'Xác nhận từ chối báo cáo?');

        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe(async (result) => {
            if (result == 'confirmed') {
                this.http.postWithParams(PostReportURL.refuseReport(), { reportId: report.id })
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result) => {
                    if (!result || !result.state) {
                        this.messageService.showErrorMessage(
                            'Lỗi',
                            result.message
                        );
                    }
                    this.messageService.showSuccessMessage('Thông báo', 'Từ chối thành công');
                    this.loadData()
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
