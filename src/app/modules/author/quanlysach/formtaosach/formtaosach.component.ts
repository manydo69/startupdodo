import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'app/shared/message.services';
import { PrimeNGConfig } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { I_CHAPTER } from '../../../../model/chapter';
import { MatDialog } from '@angular/material/dialog';
import { FormchapterComponent } from './formchapter/formchapter.component';
import { CommonApiService } from 'app/services/commonHttp';
import { Subject, takeUntil } from 'rxjs';
import { BOOK, I_BOOK } from '../../../../model/book';
import { BookURL } from 'app/services/book/book';
import { ConfirmationService } from 'app/shared/confirmation.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { API } from 'environments/environment.prod';
import { AppUltil } from 'app/shared/AppUtils';
import { CHAPTER_TYPE, STATUS } from 'app/shared/constant';
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
                this.http
                    .get(
                        BookURL.getDetail(this.id)
                    )
                    .pipe(takeUntil(this._unsubscribeAll))
                    .subscribe((res: any) => {
                        if (!res) return;
                        this.data = res.data;
                        if (this.data.status == STATUS.BAN) {
                            this.statuses = [
                                { name: "BAN", disable: true }, { name: "DRAFT", disable: true }, { name: "CHO_DUYET", disable: true }, { name: "CHUA_HOAN_THANH", disable: true }, { name: "HOAN_THANH", disable: true },
                            ]
                        }
                        else {
                            this.statuses = [
                                { name: "BAN", disable: true }, { name: "DRAFT", disable: true }, { name: "CHO_DUYET", disable: true }, { name: "CHUA_HOAN_THANH", disable: false }, { name: "HOAN_THANH", disable: false },
                            ]

                        }
                    });

            }
        });
        if (!this.data) {
            this.data = new BOOK();
            this.data.status = STATUS.DRAFT
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

    save(form) {
        if (!this.data.name) {
            this.messageService.showErrorMessage(
                'Lỗi',
                'Vui lòng nhập tên sách.'
            );
            return;
        }
        if (!this.data.id && !this.coverImageShow) {
            this.messageService.showErrorMessage(
                'Lỗi',
                'Vui lòng chọn ảnh bìa cho sách.'
            );
            return;
        }
        if (this.data.coinCost == null) {
            this.messageService.showErrorMessage(
                'Lỗi',
                'Vui lòng nhập giá sách. Nếu sách miễn phí hãy nhập 0.'
            );
            return;
        }
        // Open the confirmation and save the reference
        const dialogRef = this.confirmationService.showInfoMessage('Xác nhận', 'Đồng ý lưu và gửi sách tạo?');

        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe(async (result) => {
            if (result == 'confirmed') {
                if (this.uploadedFiles && this.uploadedFiles.length > 0 && this.uploadedFiles[this.uploadedFiles.length - 1]?.currentFiles[0]) {
                    await this.uploadCoverImage()
                }
                // this.data.status = 'CHO_DUYET';
                this.data.listChapter.push(...this.listChapterDeleted);
                try {
                    this.http
                        .post(BookURL.save(), this.data)
                        .pipe(takeUntil(this._unsubscribeAll))
                        .subscribe((res: any) => {
                            if (!res || !res.state){
                                this.messageService.showErrorMessage('Thông báo', 'Lưu thông tin sách không thành công');
                                return;
                            }
                            this.messageService.showSuccessMessage('Thông báo', 'Lưu thông tin sách thành công');
                            this._router.navigate(['/author/quanlysach/sach']);
                        });
                } catch (error) {
                    this.messageService.showErrorMessage(
                        'Lỗi',
                        'Gửi phiếu không thành công'
                    );
                }
            } else {

            }
        });
    }

    uploadCoverImage(): Promise<void> {
        return new Promise((resolve, reject) => {
            var fd = new FormData();
            fd.append('file', this.uploadedFiles[this.uploadedFiles.length - 1].currentFiles[0]);
            this.http
                .post(BookURL.uploadFile(), fd)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result) => {
                    if (!result || !result.state) {
                        reject();
                        return;
                    }
                    this.coverImage = result.data;
                    this.data.coverImage = this.coverImage
                    resolve();
                });
        });
    }

    addThanhPhan() {
        var _newRow = {
            id: null,
            bookId: null,
            name: '',
            order: this.data.listChapter.length + 1,
            content: '',
            type: "TRUYEN_CHU",
            status: "DRAFT",
            coinCost: null,
            pointCost: null,
            createDate: new Date()
        };
        this.data.listChapter.push(_newRow);
        console.log(this.data.listChapter);

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

    onRowDeleteInit(chapter) {
        const dialogRef = this.confirmationService.showWarningMessage('Xác nhận', 'Bạn có muốn xóa chương ' + chapter.order + ' không?');

        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe((result) => {
            if (result == 'confirmed') {
                if (chapter.id != null) {
                    chapter.isDeleted = true;
                    this.listChapterDeleted.push(chapter);
                }
                let index = this.data.listChapter.findIndex(item => item === chapter);
                this.data.listChapter.forEach(c => {
                    if (c.order > chapter.order) c.order--;
                })
                if (index !== -1) {
                    this.data.listChapter.splice(index, 1);
                }
            }
        });
    }

    async myUploader(event, fileForm) {
        this.uploadedFiles.push(event);
        this._fileForm = fileForm;
        if (this.uploadedFiles && this.uploadedFiles.length > 0 && this.uploadedFiles[this.uploadedFiles.length - 1]?.currentFiles[0]) {
            AppUltil.getBase64ImageFromFile(this.uploadedFiles[this.uploadedFiles.length - 1]?.currentFiles[0])
                .then((base64data) => {
                    this.coverImageShow = base64data;
                })
        } else {
            this.coverImageShow = null;
        }

    }

    deleteFile(file) {
        const dialogRef = this.confirmationService.showWarningMessage('Xác nhận', 'Bạn có muốn xóa file đính kèm không?');

        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe((result) => {
            if (result == 'confirmed') {

            }
        });
    }

    removeFile(item: any, uploader: FileUpload, event: Event) {
        const index = uploader.files.indexOf(item);
        // this.insertFile = this.insertFile.filter((element) => { return element.fileName != item.name });
        uploader.remove(event, index);
        this.uploadedFiles.push(event);
    }

    removeAllFiles(event: Event) {
        this.insertFile = []
        this.uploadedFiles.push(event)
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
            case 'BAN':
                return 'danger';
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

    onChangeStatus(chapter) {
        if (chapter.status == STATUS.DRAFT) {
            chapter.status = STATUS.HOAN_THANH
        } else if (chapter.status == STATUS.HOAN_THANH) {
            chapter.status = STATUS.DRAFT
        }
        console.log(chapter);

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
