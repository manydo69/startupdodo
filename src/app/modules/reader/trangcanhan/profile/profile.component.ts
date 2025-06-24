import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { APP_ACTION } from 'app/ngxstore/actions/app.actions';
import { AppState } from 'app/ngxstore/state/app.state';
import { CommonApiService } from 'app/services/commonHttp';
import { UserURL } from 'app/services/user/user';
import { MessageService } from 'app/shared/message.services';
import { API } from 'environments/environment.prod';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { FormbaivietComponent } from '../formbaiviet/formbaiviet.component';
import { PostURL } from 'app/services/post/post';
import { CommentURL } from 'app/services/user/comment';
import { CurrentUserService } from 'app/shared/currentUser.service';
import { PostSavingURL } from 'app/services/post/postSaving';
import { ConfirmationService } from 'app/shared/confirmation.service';
import { BookURL } from 'app/services/book/book';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
    userId: any;
    sub: any;
    is_currentUserInfo: boolean = false;

    userInfo: any;
    listPostCreate: any[];
    listBookCreate: any[];

    user$ = new BehaviorSubject<any>({});
    user: any

    ApiSaveComment: string;
    ApiListComment: string;
    ApiImage: string = API.IMG;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
        private http: CommonApiService,
        private _activatedroute: ActivatedRoute,
        private _matDialog: MatDialog,
        private store: Store<AppState>,
        private messageService: MessageService,
        private currentUserService: CurrentUserService,
        private confirmationService: ConfirmationService,
        private _router: Router,
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
        this.ApiListComment = CommentURL.getPostComment()
        this.ApiSaveComment = CommentURL.savePostComment()
        this.sub = this._activatedroute.paramMap.subscribe(paramMap => {
            this.userId = paramMap.get('id');
            // Call api
            if (this.userId) {
                this.http
                    .get(
                        UserURL.getDetailInfo(this.userId)
                    )
                    .pipe(takeUntil(this._unsubscribeAll))
                    .subscribe((res: any) => {
                        if (!res) return;
                        this.userInfo = res.data

                        if (this.userInfo.gender == 1) {
                            this.userInfo.genderText = 'Nam'
                        } else if (this.userInfo.gender == 2) {
                            this.userInfo.genderText = 'Nữ'
                        } else {
                            this.userInfo.genderText = 'Không xác định'
                        }

                        if (this.user.id == this.userId) {
                            this.is_currentUserInfo = true;
                        }
                    })
                this.http
                    .get(
                        PostURL.getAllByAuthorId(this.userId)
                    )
                    .pipe(takeUntil(this._unsubscribeAll))
                    .subscribe((res: any) => {
                        this.listPostCreate = res.data;
                    })
                this.http
                    .get(
                        BookURL.getListBookByAuthor(this.userId)
                    )
                    .pipe(takeUntil(this._unsubscribeAll))
                    .subscribe((res: any) => {
                        this.listBookCreate = res.data;
                    })
            }
        });

    }

    onTaoBaiViet() {
        const dialogRef = this._matDialog.open(FormbaivietComponent, {
            disableClose: true,
            data: null,
            width: '900px'
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.messageService.showSuccessMessage('Thông báo', result.message);
                this.http
                .get(
                    PostURL.getAllByAuthorId(this.userId)
                )
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((res: any) => {
                    this.listPostCreate = res.data;
                })
            }
        })
    }

    onSavingPost(post) {
        this.currentUserService._checkLogin().pipe().subscribe(isLogin => {
            if (isLogin) {
                this.http.postWithParams(PostSavingURL.save(), { postId: post.id })
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
                        post.isSaved = true
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

    onUnSavingBook(post) {
        this.http.delete(PostSavingURL.unSave(post.id))
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
                post.isSaved = false;
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
