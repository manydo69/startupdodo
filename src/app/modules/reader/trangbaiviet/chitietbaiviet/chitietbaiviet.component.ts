import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { I_POST_REPORT } from 'app/model/postReport';
import { CommonApiService } from 'app/services/commonHttp';
import { PostURL } from 'app/services/post/post';
import { PostReportURL } from 'app/services/report/postReport';
import { PostSavingURL } from 'app/services/post/postSaving';
import { ConfirmationService } from 'app/shared/confirmation.service';
import { STATUS } from 'app/shared/constant';
import { CurrentUserService } from 'app/shared/currentUser.service';
import { MessageService } from 'app/shared/message.services';
import { ShareData } from 'app/shared/shareservice.service';
import { API } from 'environments/environment.prod';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { CommentURL } from 'app/services/user/comment';
import { MatDialog } from '@angular/material/dialog';
import { I_POST } from 'app/model/post';

@Component({
  selector: 'app-chitietbaiviet',
  templateUrl: './chitietbaiviet.component.html',
  styleUrls: ['./chitietbaiviet.component.scss']
})
export class ChitietbaivietComponent implements OnInit, OnDestroy{
    id: any;
    sub: any;

    // Post detail
    data: I_POST= {};
    listChapter: any[] = [];
    selectedId: number;
    specialPost: any[]
    isFlip: boolean = false;

    reportVisible: boolean = false;
    reportModel: I_POST_REPORT;
    listReportCategory: any[] = []

    filesUrlArray: any[]

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
    ) {
    }

    ngOnInit(): void {
        this.reportModel = {}
        this.ApiListComment = CommentURL.getPostComment()
        this.ApiSaveComment = CommentURL.savePostComment()
        this.sub = this._activatedroute.paramMap.subscribe(paramMap => {
            this.id = paramMap.get('id');
            this.selectedId = this.id
            // Call api
            if (this.id) {
                this.http
                    .get(
                        PostURL.getDetailInfo(this.id)
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
                        console.log(this.data);

                    }, (error: any) => {
                        console.log(error);

                        this.messageService.showErrorMessage(
                            'Lỗi',
                            error.message
                        );
                    });
            }
        });

    }

    onSavingPost() {
        this.currentUserService._checkLogin().pipe().subscribe(isLogin => {
            if (isLogin) {
                this.http.postWithParams(PostSavingURL.save(), { bookId: this.data.id })
                    .pipe(takeUntil(this._unsubscribeAll))
                    .subscribe((result) => {
                        if (!result || !result.state) {
                            this.messageService.showErrorMessage(
                                'Lỗi',
                                result.message
                            );
                            return;
                        }
                        this.messageService.showSuccessMessage('Thông báo', result.message);
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

    onUnSavingPost() {
        this.http.delete(PostSavingURL.unSave(this.data.id))
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result) => {
                if (!result || !result.state) {
                    this.messageService.showErrorMessage(
                        'Lỗi',
                        result.message
                    );
                    return;
                }
                this.messageService.showSuccessMessage('Thông báo', result.message);
                this.data.isSaved = false;
            });
    }

    onReport() {
        this.currentUserService._checkLogin().pipe().subscribe(isLogin => {
            if (isLogin) {
                this.reportVisible = true;
                this.reportModel.reason = ""
            } else {
                const dialogRef = this.confirmationService.showInfoMessage('Xác nhận', 'Bạn chưa đăng nhập. Bạn có muốn đăng nhập để sử dụng đầy đủ tính năng?');

                // Subscribe to afterClosed from the dialog reference
                dialogRef.afterClosed().subscribe(async (result) => {
                    if (result == 'confirmed') {
                        this._router.navigate(['/sign-in',])
                    } else {
                        this.reportModel.reason = ''
                    }
                })
            }
        })
    }

    onReportBook() {
        this.reportModel.post = this.id;
        this.reportModel.status = STATUS.CHO_DUYET;
        this.http.post(PostReportURL.save(), this.reportModel)
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

                this.messageService.showSuccessMessage('Thông báo', "Cảm ơn bạn đã báo cáo!");
                this.reportVisible = false;
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
