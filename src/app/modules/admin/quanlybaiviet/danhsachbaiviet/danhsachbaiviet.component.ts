import { messages } from './../../../../mock-api/apps/chat/data';
import { Component, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormbaivietComponent } from 'app/modules/reader/trangcanhan/formbaiviet/formbaiviet.component';
import { CommonApiService } from 'app/services/commonHttp';
import { PostURL } from 'app/services/post/post';
import { ConfirmationService } from 'app/shared/confirmation.service';
import { DEVICE_TYPE, STATUS } from 'app/shared/constant';
import { MessageService } from 'app/shared/message.services';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-danhsachbaiviet',
  templateUrl: './danhsachbaiviet.component.html',
  styleUrls: ['./danhsachbaiviet.component.scss']
})
export class DanhsachbaivietComponent {
    statuses: any[];
    listPost: any[];

    widthOff: number;
    deviceType: string;

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private _matDialog: MatDialog,
        private http: CommonApiService,
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
        .get(PostURL.getListPostByAdmin())
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((res: any) => {
            if (!res) return;
            this.listPost = res.data;
        });
    }

    onInfoPost(post) {
        post.isView = true
        const dialogRef = this._matDialog.open(FormbaivietComponent, {
            disableClose: true,
            data: post,
            width: '900px',
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {

            }
        })
    }

    onBanPost(post) {
        const dialogRef = this.confirmationService.showInfoMessage('Xác nhận', 'Xác nhận chặn bài viết?');

        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe(async (result) => {
            if (result == 'confirmed') {
                this.http.postWithParams(PostURL.banPost(), { postId: post.id })
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

    onUnBanPost(post) {
        const dialogRef = this.confirmationService.showInfoMessage('Xác nhận', 'Xác nhận bỏ chặn bài viết?');

        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe(async (result) => {
            if (result == 'confirmed') {
                this.http.postWithParams(PostURL.onUnBanPost(), { postId: post.id })
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

    getSeverity(enabled) {
        if (enabled) return 'success';
        else return 'danger'
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
