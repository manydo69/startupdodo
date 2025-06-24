import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { UserService } from 'app/core/user/user.service';
import { APP_ACTION } from 'app/ngxstore/actions/app.actions';
import { AppState } from 'app/ngxstore/state/app.state';
import { CommonApiService } from 'app/services/commonHttp';
import { FileURL } from 'app/services/file/file';
import { UserURL } from 'app/services/user/user';
import { AppUltil } from 'app/shared/AppUtils';
import { ConfirmationService } from 'app/shared/confirmation.service';
import { CurrentUserService } from 'app/shared/currentUser.service';
import { MessageService } from 'app/shared/message.services';
import { API } from 'environments/environment.prod';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-formthongtin',
    templateUrl: './formthongtin.component.html',
    styleUrls: ['./formthongtin.component.scss']
})
export class FormthongtinComponent {
    userInfo: any = {};
    is_currentUserInfo: boolean = false;

    dataShow: any;
    genders: any[] = [{id: 0, name: "Không xác định"} , {id: 1, name: "Nam"}, {id: 2, name: "Nữ"}]

    //file
    uploadedFiles: any[] = [];
    _fileForm: any;
    file: File;
    insertFile: any;

    stateOptions: any[]

    user$ = new BehaviorSubject<any>({});
    user: any
    ApiImage: string = API.IMG;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
        private http: CommonApiService,
        private _activatedroute: ActivatedRoute,
        private currentUserService: CurrentUserService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
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
        this.stateOptions = [{label: 'Off', value: false}, {label: 'On', value: true}];
        this.genders = [{id: 0, name: "Không xác định"} , {id: 1, name: "Nam"}, {id: 2, name: "Nữ"}];
        if (this.user) {
            this.loadData()
        } else {

        }
    }

    loadData() {
        this.http
        .get(
            UserURL.getMyInfo()
        )
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((res: any) => {
            if (!res) return;
            this.userInfo = res.data
            this.dataShow = {...res.data}
            if (this.userInfo.birthday) this.userInfo.birthday = new Date(this.userInfo.birthday)
        })
    }

    onSaveUserInfo(form) {
        if (form.invalid) {
            this.messageService.showErrorMessage(
                'Lỗi',
                'Họ tên không được để trống. Bạn hãy kiểm tra lại.'
            );
            return;
        }
        // Open the confirmation and save the reference
        const dialogRef = this.confirmationService.showInfoMessage('Xác nhận', 'Bạn muốn cập nhật thông tin cá nhân?');

        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe(async (result) => {
            if (result == 'confirmed') {
                // if (this.uploadedFiles && this.uploadedFiles.length > 0 && this.uploadedFiles[this.uploadedFiles.length - 1]?.currentFiles[0]) {
                //     await this.uploadCoverImage()
                // }
                this.http
                    .post(UserURL.updateInfo(), this.userInfo)
                    .pipe(takeUntil(this._unsubscribeAll))
                    .subscribe((res: any) => {
                        if (!res || !res.state){
                            this.messageService.showErrorMessage('Thông báo', 'Lưu thông tin không thành công');
                            return;
                        }
                        this.messageService.showSuccessMessage('Thông báo', res.message);
                        this.loadData();
                    });
            }
        });
    }

    uploadCoverImage(): Promise<void> {
        return new Promise((resolve, reject) => {
            var fd = new FormData();
            fd.append('file', this.uploadedFiles[this.uploadedFiles.length - 1].currentFiles[0]);
            this.http
                .post(FileURL.uploadFile(), fd)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result) => {
                    if (!result || !result.state) {
                        reject();
                        return;
                    }
                    this.userInfo.avatar = result.data;
                    this.dataShow.coverImage = result.data;
                    this.http
                    .post(UserURL.updateInfo(), this.userInfo)
                    .pipe(takeUntil(this._unsubscribeAll))
                    .subscribe((res: any) => {
                        if (!res || !res.state){
                            this.messageService.showErrorMessage('Thông báo', 'Lưu thông tin không thành công');
                            return;
                        }
                        this.messageService.showSuccessMessage('Thông báo', 'Cập nhật ảnh đại diện thành công');
                        this.loadData();
                        if (this._fileForm) {
                            this._fileForm.clear()
                        }
                    });
                    resolve();
                });
        });
    }

    async myUploader(event, fileForm) {
        this.uploadedFiles.push(event);
        this._fileForm = fileForm;
        this.uploadCoverImage()
    }

    deleteFile(file) {
        const dialogRef = this.confirmationService.showWarningMessage('Xác nhận', 'Bạn có muốn xóa file đính kèm không?');

        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe((result) => {
            if (result == 'confirmed') {

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
    }
}
