import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookURL } from 'app/services/book/book';
import { CommonApiService } from 'app/services/commonHttp';
import { API } from 'environments/environment.prod';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { ShareData } from 'app/shared/shareservice.service';
import { CurrentUserService } from 'app/shared/currentUser.service';
import { ConfirmationService } from 'app/shared/confirmation.service';
import { MessageService } from 'app/shared/message.services';
import { BOOK_RATING, I_BOOK_RATING } from 'app/model/bookRating';
import { I_BOOK_REPORT } from 'app/model/bookReport';
import { ReportCategoryURL } from 'app/services/report/reportcategory';
import { BookReportURL } from 'app/services/report/bookreport';
import { STATUS } from 'app/shared/constant';
import { BookSavingURL } from 'app/services/book/bookSaving';
import { UserService } from 'app/core/user/user.service';
import { Store } from '@ngrx/store';
import { AppState } from 'app/ngxstore/state/app.state';
import { APP_ACTION } from 'app/ngxstore/actions/app.actions';
import { TopicURL } from 'app/services/topic/topic';

@Component({
    selector: 'app-chitietsach',
    templateUrl: './chitietsach.component.html',
    styleUrls: ['./chitietsach.component.scss']
})
export class ChitietsachComponent implements OnInit, OnDestroy {
    id: any;
    sub: any;
    user: any;
    // Book detail
    data: any;
    listTopic
    chaptersShow: any[] = []

    // Book rating
    ratingModel: BOOK_RATING;
    rating;
    ratingVisible: boolean = false;
    listRating: I_BOOK_RATING[] = []
    pageNum = 0

    // Book report
    reportVisible: boolean = false;
    reportModel: I_BOOK_REPORT;
    listReportCategory: any[] = []

    user$ = new BehaviorSubject<any>({});

    ApiImage: string = API.IMG;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
        private http: CommonApiService,
        private _activatedroute: ActivatedRoute,
        private shareData: ShareData,
        private currentUserService: CurrentUserService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private _router: Router,
        private _userService: UserService,
        private store: Store<AppState>
    ) {
        const appUser = this.store.select((state) => state.appUser);
        appUser.subscribe((res: any) => {
            const data = res;
            if (data && data.type === APP_ACTION.USER_INFO) {
                this.user = { ...data.payload };
                this.user$.next(this.user);
            }
        });
    }

    ngOnInit(): void {
        // this.user = this._userService.get();
        this.reportModel = {}
        this.ratingModel = {}
        this.sub = this._activatedroute.paramMap.subscribe(paramMap => {
            this.id = paramMap.get('id');
            // Call api
            if (this.id) {
                this.http
                    .get(
                        BookURL.getDetailInfo(this.id)
                    )
                    .pipe(takeUntil(this._unsubscribeAll))
                    .subscribe((res: any) => {
                        if (!res) return;
                        this.data = res.data;
                        this.chaptersShow = this.data.listChapter.slice(0, 50)

                        this.currentUserService._checkLogin().pipe().subscribe(isLogin => {
                            if (isLogin) {
                                this.http
                                .get(
                                    BookURL.getRatingByUser(this.data.id)
                                )
                                .pipe(takeUntil(this._unsubscribeAll))
                                .subscribe((res: any) => {
                                    if (!res) return;
                                    if(res.data) this.ratingModel = res.data;
                                    else {
                                        this.ratingModel = {
                                            id: null,
                                            rate: 0,
                                            comment: '',
                                            book: null,
                                            user: null
                                        }
                                    }
                                });
                            }
                        })
                    });

                this.loadRatings(0);
            }
        });
        this.http
            .get(
                TopicURL.getListTopic()
            )
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res: any) => {
                if (!res) return;
                this.listTopic = res.data;

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

    onPageChange(event: any, rows: number) {
        this.chaptersShow = this.data.listChapter.slice(event.first, event.first + rows)
    }

    onOpenChapter(chapter) {
        console.log(chapter);

        if (!chapter.readable) {
            chapter.visibleDialog = true;
            return;
        }
        this.shareData.sendMessage("BOOK", this.data)
        this._router.navigate(['../../chapter', chapter.id], { relativeTo: this._activatedroute })
    }

    loadRatings(pageNum) {
        this.http
        .getWithParams(
            BookURL.getRatings(this.id), {pageNo: pageNum}
        )
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((res: any) => {
            if (!res) return;
            let result: I_BOOK_RATING[] = res.data
            if(result.length == 0) this.pageNum--;
            this.listRating.push(...result);

        });
    }

    onRating() {
        this.currentUserService._checkLogin().pipe().subscribe(isLogin => {
            if (isLogin) {
                this.ratingVisible = true;
            } else {
                const dialogRef = this.confirmationService.showInfoMessage('Xác nhận', 'Bạn chưa đăng nhập. Bạn có muốn đăng nhập để sử dụng đầy đủ tính năng?');

                // Subscribe to afterClosed from the dialog reference
                dialogRef.afterClosed().subscribe(async (result) => {
                    if (result == 'confirmed') {
                        this._router.navigate(['/sign-in',])
                    } else {
                        this.ratingModel.rate = 0
                    }
                })
            }
        })
    }

    onRatingBook() {
        this.ratingModel.book = this.id;
        this.http.post(BookURL.rating(), this.ratingModel)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result) => {
                if (!result || !result.state) {
                    this.messageService.showErrorMessage(
                        'Lỗi',
                        "Đánh giá không thành công"
                    );
                    this.ratingVisible = false;
                    return;
                }
                console.log("aaaa");

                this.messageService.showSuccessMessage('Thông báo', "Cảm ơn bạn đã đánh giá!");
                this.ratingVisible = false;
                this.http
                .get(
                    BookURL.getRatingByUser(this.data.id)
                )
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((res: any) => {
                    if (!res) return;
                    if(res.data) this.ratingModel = res.data;
                    else {
                        this.ratingModel = {
                            id: null,
                            rate: 0,
                            comment: '',
                            book: null,
                            user: null
                        }
                    }
                });
            });

    }

    onReport() {
        this.currentUserService._checkLogin().pipe().subscribe(isLogin => {
            if (isLogin) {
                this.reportVisible = true;
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

    onSavingBook() {
        this.currentUserService._checkLogin().pipe().subscribe(isLogin => {
            if (isLogin) {
                this.http.postWithParams(BookSavingURL.save(), { bookId: this.id })
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
        this.http.delete(BookSavingURL.unSave(this.id))
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

    onBuyBook() {
        this.currentUserService._checkLogin().pipe().subscribe(isLogin => {
            if (isLogin) {
                // Open the confirmation and save the reference
                const dialogRef = this.confirmationService.showInfoMessage('Xác nhận', 'Đồng ý mua sách?');

                // Subscribe to afterClosed from the dialog reference
                dialogRef.afterClosed().subscribe(async (result) => {
                    if (result == 'confirmed') {
                        this.http.postWithParams(BookURL.buyBook(), { bookId: this.id })
                        .pipe(takeUntil(this._unsubscribeAll))
                        .subscribe((result) => {
                            if (!result || !result.state) {
                                this.messageService.showErrorMessage(
                                    'Lỗi',
                                    result.message
                                );
                                return;
                            }
                            this.messageService.showSuccessMessage('Thông báo', 'Mua thành công');
                            this.data.isUnlock = true;
                        });
                    }
                })
            } else {
                const dialogRef = this.confirmationService.showInfoMessage('Xác nhận', 'Bạn chưa đăng nhập. Bạn có muốn đăng nhập để sử dụng đầy đủ tính năng?');

                // Subscribe to afterClosed from the dialog reference
                dialogRef.afterClosed().subscribe(async (result) => {
                    if (result == 'confirmed') {
                        this._router.navigate(['/sign-in',])
                    } else {
                        // this.reportModel.content = ''
                    }
                })
            }
        })
    }

    onBuyChapter(chapter) {
        this.currentUserService._checkLogin().pipe().subscribe(isLogin => {
            if (isLogin) {
                // Open the confirmation and save the reference
                const dialogRef = this.confirmationService.showInfoMessage('Xác nhận', 'Đồng ý mua chương?');

                // Subscribe to afterClosed from the dialog reference
                dialogRef.afterClosed().subscribe(async (result) => {
                    if (result == 'confirmed') {
                        this.http.postWithParams(BookURL.buyChapter(), { chapterId: chapter.id })
                        .pipe(takeUntil(this._unsubscribeAll))
                        .subscribe((result) => {
                            if (!result || !result.state) {
                                this.messageService.showErrorMessage(
                                    'Lỗi',
                                    result.message
                                );
                                return;
                            }
                            this.messageService.showSuccessMessage('Thông báo', 'Mua thành công');
                            this.data.isUnlock = true;
                            chapter.readable = true;
                        });
                    }
                })
            } else {
                const dialogRef = this.confirmationService.showInfoMessage('Xác nhận', 'Bạn chưa đăng nhập. Bạn có muốn đăng nhập để sử dụng đầy đủ tính năng?');

                // Subscribe to afterClosed from the dialog reference
                dialogRef.afterClosed().subscribe(async (result) => {
                    if (result == 'confirmed') {
                        this._router.navigate(['/sign-in',])
                    } else {
                        // this.reportModel.content = ''
                    }
                })
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
        this.sub.unsubscribe()

    }
}
