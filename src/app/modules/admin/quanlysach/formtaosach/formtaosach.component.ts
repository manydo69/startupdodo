import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'app/shared/message.services';
import { PrimeNGConfig } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { MatDialog } from '@angular/material/dialog';
import { FormchapterComponent } from './formchapter/formchapter.component';
import { CommonApiService } from 'app/services/commonHttp';
import { Subject, takeUntil } from 'rxjs';
import { BookURL } from 'app/services/book/book';
import { ConfirmationService } from 'app/shared/confirmation.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { API } from 'environments/environment.prod';
import { AppUltil } from 'app/shared/AppUtils';
import { CHAPTER_TYPE, STATUS } from 'app/shared/constant';
import { BOOK, I_BOOK } from 'app/model/book';
import { TopicURL } from 'app/services/topic/topic';

@Component({
    selector: 'app-formtaosach',
    templateUrl: './formtaosach.component.html',
    styleUrls: ['./formtaosach.component.scss']
})
export class FormtaosachComponent implements OnInit, OnDestroy {
    //Update
    id: any
    sub: any

    data: I_BOOK;
    _newRow;
    listTopic: any[] = [];
    statuses: any[]
    listChapterDeleted: any[] = [];

    // URL and Base64
    coverImage
    coverImageShow: any;

    //file
    uploadedFiles: any[] = [];
    _fileForm: any;
    file: File;
    insertFile: any;

    ApiImage: string = API.IMG;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private _matDialog: MatDialog,
        private http: CommonApiService,
        private _activatedroute: ActivatedRoute,
        private _router: Router
    ) {
    }

    ngOnInit(): void {
        this.statuses = [
            { name: "BAN", disable: true }, { name: "DRAFT", disable: false }, { name: "CHO_DUYET", disable: false }, { name: "CHUA_HOAN_THANH", disable: true }, { name: "HOAN_THANH", disable: true },
        ]
        this.sub = this._activatedroute.paramMap.subscribe(paramMap => {
            this.id = paramMap.get('id');
            // Call api
            if (this.id) {
                this.loadData()
            }
        });
        if (!this.data) {
            this.data = new BOOK();
            this.data.listChapter = []
        }
        this.http
            .get(
                TopicURL.getListTopic()
            )
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res: any) => {
                if (!res) return;
                this.listTopic = res.data;

            });
    }

    loadData() {
        this.http
        .get(
            BookURL.getDetail(this.id)
        )
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((res: any) => {
            if (!res) return;
            this.data = res.data;
        });
    }

    onApproveBook() {
        const dialogRef = this.confirmationService.showInfoMessage('Xác nhận', 'Xác nhận xét duyệt sách?');

        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe(async (result) => {
            if (result == 'confirmed') {
                this.http.postWithParams(BookURL.approveBook(), { bookId: this.data.id })
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

    onBanBook() {
        const dialogRef = this.confirmationService.showInfoMessage('Xác nhận', 'Xác nhận chặn sách?');

        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe(async (result) => {
            if (result == 'confirmed') {
                this.http.postWithParams(BookURL.banBook(), { bookId: this.data.id })
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

    onBanChapter(chapter) {
        const dialogRef = this.confirmationService.showInfoMessage('Xác nhận', 'Xác nhận chặn?');

        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe(async (result) => {
            if (result == 'confirmed') {
                this.http.postWithParams(BookURL.banChapter(), { chapterId: chapter.id })
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result) => {
                    if (!result || !result.state) {
                        this.messageService.showErrorMessage(
                            'Lỗi',
                            'Chặn không thành công'
                        );
                    }
                    this.messageService.showSuccessMessage('Thông báo', 'Chặn thành công');
                    this.loadData()
                });
            }
        })
    }

    onUnBanChapter(chapter) {
        const dialogRef = this.confirmationService.showInfoMessage('Xác nhận', 'Xác nhận bỏ chặn?');

        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe(async (result) => {
            if (result == 'confirmed') {
                this.http.postWithParams(BookURL.unbanChapter(), { chapterId: chapter.id })
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result) => {
                    if (!result || !result.state) {
                        this.messageService.showErrorMessage(
                            'Lỗi',
                            'Bỏ chặn không thành công'
                        );
                    }
                    this.messageService.showSuccessMessage('Thông báo', 'Bỏ chặn thành công');
                    this.loadData()
                });
            }
        })
    }

    onRowEditInit(chapter, index) {
        if (chapter.id != null && chapter.type == CHAPTER_TYPE.TRUYEN_TRANH && chapter.files == null) {
            this.http
                .get(
                    BookURL.getChapter(chapter.id)
                )
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((res: any) => {
                    if (!res) return;
                    chapter = res.data;
                    const dialogRef = this._matDialog.open(FormchapterComponent, {
                        disableClose: true,
                        data: chapter,
                        width: '900px'
                    });
                    dialogRef.afterClosed().subscribe((result) => {
                        this.data.listChapter[index] = result

                    })
                });
        } else {
            const dialogRef = this._matDialog.open(FormchapterComponent, {
                disableClose: true,
                data: chapter,
                width: '900px'
            });
            dialogRef.afterClosed().subscribe((result) => {
                this.data.listChapter[index] = result

            })
        }

    }

    blobToBase64(blob: Blob) {
        return new Promise((resolve, _) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    }

    getSeverityBook(status) {
        switch (status) {
            case 'DRAFT':
                return 'warning';
            case 'HOAN_THANH':
                return 'success';
            case 'CHUA_HOAN_THANH':
                return 'infor';
            case 'CHO_DUYET':
                return '';
        }
    }

    getSeverity(status) {
        let statusText: string = "Tạo mới";
        if (status == 0) statusText = "Bản nháp";
        else statusText = "Đã phát hành"
        switch (status) {
            case STATUS.BAN:
                return 'danger';
            case STATUS.DRAFT:
                return 'warning';
            case STATUS.HOAN_THANH:
                return 'success';
            // case 'CHUA_HOAN_THANH':
            //     return 'infor';
        }
    }


    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
        this.sub.unsubscribe()

    }
}
