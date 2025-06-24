import { HttpParams } from '@angular/common/http';
import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { CommonApiService } from 'app/services/commonHttp';
import { CommentURL } from 'app/services/user/comment';
import { ConfirmationService } from 'app/shared/confirmation.service';
import { CurrentUserService } from 'app/shared/currentUser.service';
import { MessageService } from 'app/shared/message.services';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { AppUltil } from 'app/shared/AppUtils';
import { API } from 'environments/environment.prod';
import { UserService } from 'app/core/user/user.service';
import { Store } from '@ngrx/store';
import { AppState } from 'app/ngxstore/state/app.state';
import { APP_ACTION } from 'app/ngxstore/actions/app.actions';
@Component({
    selector: 'app-comment',
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit, OnChanges, OnDestroy {
    @ViewChild('messageInput') messageInput: ElementRef;
    @ViewChildren('reply') components: QueryList<any>;
    @Input('objecId') objectId: any;
    @Input('apiListComment') apiListComment: string;
    @Input('apiSavecomment') apiSavecomment: string;

    sendMessageForm: FormGroup;
    private messageFormControl: FormControl;

    messageReply = ''

    listComment: any[] = []
    commentTree: any[]
    totalNum: number;
    pageNo: number = 0;

    replyId: number;

    user: any
    user$ = new BehaviorSubject<any>({});
    ApiImage: string = API.IMG;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
        private messageService: MessageService,
        private http: CommonApiService,
        private currentUserService: CurrentUserService,
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
        this.buildSendMessageForm();
        this.loadData()
    }

    ngOnChanges(): void {
        if (this.objectId) {
            this.buildSendMessageForm();
            this.loadData()
            this.pageNo = 0
            this.replyId = null
        }
    }

    loadData() {
        console.log("APi", this.apiListComment, this.apiSavecomment);

        let params = new HttpParams();
        params = params.set('id', this.objectId)
        this.http
            .getWithParams(
                this.apiListComment, params
            )
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res: any) => {
                if (!res) return;
                res.data.comments.forEach(comment => {
                    comment.hiddenChild = true
                    comment.reply = false
                })
                this.listComment = [...this.listComment, ...res.data.comments];
                this.totalNum = res.data.totalNum
                this.generateTreeComment()
            });
    }


    addEmoji(event: EmojiEvent): void {
        this.messageInput.nativeElement.focus();
        const selectionStart = this.messageInput.nativeElement.selectionStart;
        const currentValue = this.messageInput.nativeElement.value;
        const newValue = currentValue.substring(0, selectionStart) + event.emoji.native + currentValue.substring(selectionStart);
        this.messageFormControl.setValue(newValue);
        // the following 2 lines set the caret position behind the emoji
        this.messageInput.nativeElement.selectionStart = selectionStart + event.emoji.native.length;
        this.messageInput.nativeElement.selectionEnd = selectionStart + event.emoji.native.length;
    }

    addEmojiReply(event: EmojiEvent): void {
        this.messageReply = this.messageReply + event.emoji.native;
    }

    onReply(commentId) {
        this.replyId = commentId;
    }

    generateTreeComment() {
        this.commentTree = this.listComment.filter((item) => item.parentId == null)
        this.commentTree.forEach(element => {
        this.findChildren(this.listComment, element);
        });

        console.log(this.commentTree);

    }

    findChildren(donvis: any[], element: any) {
        element.children = donvis.filter((item) => (item.parentId && item.parentId === element.id))
        element.children.forEach((child: any) => {
          this.findChildren(donvis, child);
        });
    }

    submit(form) {
        this.currentUserService._checkLogin().pipe().subscribe(isLogin => {
            if (isLogin) {
                if (form.invalid) {
                    this.messageService.showErrorMessage(
                        'Lỗi',
                        "Thông tin nhập thiếu. Xin hãy kiểm tra lại"
                    );
                    return;
                }
                this.http
                    .post(this.apiSavecomment, { objectId: this.objectId, parentId: null, content: this.sendMessageForm.get('message').value })
                    .pipe(takeUntil(this._unsubscribeAll))
                    .subscribe((res: any) => {
                        if (!res || !res.state) {
                            this.messageService.showErrorMessage('Thông báo', 'Bình luận không thành công');
                            return;
                        }
                        this.messageService.showSuccessMessage('Thông báo', 'Bình luân thành công');
                        this.sendMessageForm.reset();
                        this.messageFormControl.setValue('');
                        this.loadData()
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

    submitFormReply(form) {
        this.currentUserService._checkLogin().pipe().subscribe(isLogin => {
            if (isLogin) {
                if (form.invalid) {
                    this.messageService.showErrorMessage(
                        'Lỗi',
                        "Thông tin nhập thiếu. Xin hãy kiểm tra lại"
                    );
                    return;
                }
                this.http
                    .post(this.apiSavecomment, { objectId: this.objectId, parentId: this.replyId, content: this.messageReply })
                    .pipe(takeUntil(this._unsubscribeAll))
                    .subscribe((res: any) => {
                        if (!res || !res.state) {
                            this.messageService.showErrorMessage('Thông báo', 'Bình luận không thành công');
                            return;
                        }
                        this.messageService.showSuccessMessage('Thông báo', 'Bình luận thành công');
                        this.sendMessageForm.reset();
                        this.messageFormControl.setValue('');
                        this.replyId = null;
                        this.loadData()
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

    private buildSendMessageForm(): void {
        this.messageFormControl = new FormControl('', [Validators.required]);
        this.sendMessageForm = new FormGroup({
            message: this.messageFormControl
        });
    }

    calculateTime(start: Date, end: Date) {
        return AppUltil.timeDifferenceInMinutes(start, end);
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
