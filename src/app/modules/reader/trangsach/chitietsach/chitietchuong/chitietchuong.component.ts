import { ThisReceiver } from '@angular/compiler';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Book, BookPageSide, PageType } from '@labsforge/flipbook';
import { I_BOOK_REPORT } from 'app/model/bookReport';
import { I_CHAPTER } from 'app/model/chapter';
import { FlipbookviewComponent } from 'app/modules/component/flipbookview/flipbookview.component';
import { BookURL } from 'app/services/book/book';
import { BookSavingURL } from 'app/services/book/bookSaving';
import { CommonApiService } from 'app/services/commonHttp';
import { BookReportURL } from 'app/services/report/bookreport';
import { ReportCategoryURL } from 'app/services/report/reportcategory';
import { CommentURL } from 'app/services/user/comment';
import { ReadHistoryURL } from 'app/services/user/userReadHistory';
import { ConfirmationService } from 'app/shared/confirmation.service';
import { DEVICE_TYPE, STATUS } from 'app/shared/constant';
import { CurrentUserService } from 'app/shared/currentUser.service';
import { MessageService } from 'app/shared/message.services';
import { NotificationService } from 'app/shared/notification.service';
import { ShareData } from 'app/shared/shareservice.service';
import { API } from 'environments/environment.prod';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-chitietchuong',
    templateUrl: './chitietchuong.component.html',
    styleUrls: ['./chitietchuong.component.scss']
})
export class ChitietchuongComponent implements OnInit, OnDestroy {
    id: any;
    sub: any;

    // Chapter detail
    data: I_CHAPTER = {};
    listChapter: any[] = [];
    selectedId: number;
    specialBook: any[]
    flipBook: Book;
    isFlip: boolean = false;

    reportVisible: boolean = false;
    reportModel: I_BOOK_REPORT;
    listReportCategory: any[] = []

    filesUrlArray: any[]

    widthOff;
    heightOff;
    deviceType;

    firebaseToken;

    ApiSaveComment: string;
    ApiListComment: string;
    ApiImage: string = API.IMG;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
        private http: CommonApiService,
        private _activatedroute: ActivatedRoute,
        private _router: Router,
        private messageService: MessageService,
        private currentUserService: CurrentUserService,
        private confirmationService: ConfirmationService,
        private notificationService: NotificationService,
        private _matDialog: MatDialog,
    ) {
        this.notificationService.pushNotifyToken$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((response: string) => {
            if (!response) return;
            this.firebaseToken = response;
        });
    }

    @HostListener('window:resize', ['$event'])
    onWindowResize() {
        this.onChangeWidthSize()
    }

    onChangeWidthSize() {
        this.widthOff = window.innerWidth;
        this.heightOff = window.innerHeight;
        if (this.widthOff < 768) {
            this.deviceType = DEVICE_TYPE.MOBILE;
        } else if (this.widthOff < 1024) {
            this.deviceType = DEVICE_TYPE.TABLET
        } else {
            this.deviceType = DEVICE_TYPE.PC;
        }
    }

    ngOnInit(): void {
        this.onChangeWidthSize()
        this.reportModel = {}
        this.ApiListComment = CommentURL.getChapterComment()
        this.ApiSaveComment = CommentURL.saveChapterComment()
        this.sub = this._activatedroute.paramMap.subscribe(paramMap => {
            this.id = paramMap.get('idchapter');
            this.selectedId = this.id
            // Call api
            if (this.id) {
                this.http
                    .get(
                        BookURL.getChapterDetailInfo(this.id)
                    )
                    .pipe(takeUntil(this._unsubscribeAll))
                    .subscribe((res: any) => {
                        if (!res) return;
                        if (!res.state) {
                            this.messageService.showErrorMessage(
                                'Lỗi',
                                res.message
                            );
                            return;
                        }
                        this.data = res.data;

                        // Save History
                        this.saveReadHistory(this.id, this.data.bookId, this.firebaseToken)

                        this.http
                            .get(
                                BookURL.getListChapter(this.data.bookId)
                            )
                            .pipe(takeUntil(this._unsubscribeAll))
                            .subscribe((res: any) => {
                                if (!res) return;
                                this.listChapter = res.data;
                            });
                    }, (error: any) => {
                        console.log(error);

                        this.messageService.showErrorMessage(
                            'Lỗi',
                            error.message
                        );
                    });

            }
        });
        this.http
            .getWithParams(
                BookURL.getListBookBestRating(), null
            )
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res: any) => {
                if (!res) return;
                this.specialBook = res.data;
            });
        this.http
            .get(
                ReportCategoryURL.getList()
            )
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res: any) => {
                if (!res) return;
                this.listReportCategory = res.data;

            });
    }

    generateFlipBook() {
        this.isFlip = true
        if (this.isFlip) {
            var files = this.data.files.map((file) => this.ApiImage + file.fileUrl)
            let height;
            let widthDialog;
            if (this.deviceType == DEVICE_TYPE.MOBILE) {
                widthDialog = this.widthOff*0.8
            } else {
                height = this.heightOff *0.9
                widthDialog = 2*height*2/3
            }
            const dialogRef = this._matDialog.open(FlipbookviewComponent, {
                disableClose: false,
                data: {
                    files: files,
                    content: this.data.content,
                    type: this.data.type,
                    bookTitle: this.data.bookName,
                },
                panelClass: 'custom-modalbox',
                width: `${widthDialog}px`
            });
            dialogRef.afterClosed().subscribe((result) => {
            })
        }
    }

    changeChapter(id) {
        this._router.navigate(['../', id], { relativeTo: this._activatedroute });
    }

    onSavingBook() {
        this.currentUserService._checkLogin().pipe().subscribe(isLogin => {
            if (isLogin) {
                this.http.postWithParams(BookSavingURL.save(), { bookId: this.data.bookId })
                    .pipe(takeUntil(this._unsubscribeAll))
                    .subscribe((result) => {
                        if (!result || !result.state) {
                            this.messageService.showErrorMessage(
                                'Lỗi',
                                'Lưu sách không thành công'
                            );
                            return;
                        }
                        this.messageService.showSuccessMessage('Thông báo', 'Thêm vào danh sách lưu thành công');
                        this.data.isSaved = true;
                    });
            } else {
                const dialogRef = this.confirmationService.showInfoMessage('Xác nhận', 'Bạn chưa đăng nhập. Bạn có muốn đăng nhập để sử dụng đầy đủ tính năng?');

                // Subscribe to afterClosed from the dialog reference
                dialogRef.afterClosed().subscribe(async (result) => {
                    if (result == 'confirmed') {
                        this._router.navigate(['/sign-in',])
                    }
                })
            }
        })
    }

    onUnSavingBook() {
        this.http.delete(BookSavingURL.unSave(this.data.bookId))
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result) => {
                if (!result || !result.state) {
                    this.messageService.showErrorMessage(
                        'Lỗi',
                        'Bỏ lưu sách không thành công'
                    );
                    return;
                }
                this.messageService.showSuccessMessage('Thông báo', 'Bỏ lưu thành công');
                this.data.isSaved = false;
            });
    }

    onReport() {
        this.currentUserService._checkLogin().pipe().subscribe(isLogin => {
            if (isLogin) {
                this.reportVisible = true;
                this.reportModel.content = `Chương ${this.data?.order}. `
            } else {
                const dialogRef = this.confirmationService.showInfoMessage('Xác nhận', 'Bạn chưa đăng nhập. Bạn có muốn đăng nhập để sử dụng đầy đủ tính năng?');

                // Subscribe to afterClosed from the dialog reference
                dialogRef.afterClosed().subscribe(async (result) => {
                    if (result == 'confirmed') {
                        this._router.navigate(['/sign-in',])
                    } else {
                        this.reportModel.content = ''
                    }
                })
            }
        })
    }

    onReportBook() {
        this.reportModel.book = this.id;
        this.reportModel.status = STATUS.CHO_DUYET;
        if (!this.reportModel.category) {
            this.messageService.showErrorMessage(
                'Lỗi',
                "Hãy chọn loại vi phạm"
            );
            return;
        }
        this.http.post(BookReportURL.save(), this.reportModel)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result) => {
                if (!result || !result.state) {
                    this.messageService.showErrorMessage(
                        'Lỗi',
                        "Đánh giá không thành công"
                    );
                    this.reportVisible = false;
                    return;
                }
                console.log("aaaa");

                this.messageService.showSuccessMessage('Thông báo', "Cảm ơn bạn đã đánh giá!");
                this.reportVisible = false;
                this.http
                .get(
                    BookURL.getRatingByUser(this.data.id)
                )
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((res: any) => {
                    if (!res) return;
                    if(res.data) this.reportModel = res.data;
                    else {
                        this.reportModel = {
                            id: null,
                            content: '',
                            category: null,
                            book: null,
                            user: null
                        }
                    }
                });
            });

    }

    saveReadHistory(chapterId, bookId, firebaseToken) {
        this.http.post(ReadHistoryURL.saveHistory(), { chapterId: chapterId, bookId: bookId, deviceToken: firebaseToken })
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((result) => {
            if (!result || !result.state) {
                return;
            }
        });
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
