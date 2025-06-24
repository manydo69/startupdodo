import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { BooleanInput } from '@angular/cdk/coercion';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { UserService } from 'app/core/user/user.service';
import { API } from 'environments/environment.prod';
import { Store } from '@ngrx/store';
import { AppState } from 'app/ngxstore/state/app.state';
import { APP_ACTION } from 'app/ngxstore/actions/app.actions';
import { CommonApiService } from 'app/services/commonHttp';
import { UserURL } from 'app/services/user/user';
import { MessageService } from 'app/shared/message.services';

@Component({
    selector: 'user',
    templateUrl: './user.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'user'
})
export class UserComponent implements OnInit, OnDestroy {
    @ViewChild('userActions') userActions: any
    /* eslint-disable @typescript-eslint/naming-convention */
    static ngAcceptInputType_showAvatar: BooleanInput;
    /* eslint-enable @typescript-eslint/naming-convention */

    showAvatar: boolean = true;
    user: any;
    user$ = new BehaviorSubject<any>({});
    isAuthor: boolean = false;

    ApiImage: string = API.IMG;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _userService: UserService,
        private store: Store<AppState>,
        private http: CommonApiService,
        private messageService: MessageService,
    ) {
        const appUser = this.store.select((state) => state.appUser);
        appUser.subscribe((res: any) => {
            const data = res;
            if (data && data.type === APP_ACTION.USER_INFO) {
                this.user = { ...data.payload };
                this.user$.next({ ...data.payload });
                this.isAuthor = this.user.roles.includes('AUTHOR');
                setInterval(() => { this._changeDetectorRef.detectChanges(); }, 500);
            }
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to user changes

        // Mark for check
        // this._changeDetectorRef.markForCheck();
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Update the user status
     *
     * @param status
     */
    updateUserStatus(status: string): void {
        // Return if user is not available
        if (!this.user$) {
            return;
        }

        // Update the user
        // this._userService.update({
        //     ...this.user,
        //     status
        // })
    }

    onRouteProfile() {
        this._router.navigate(['/canhan/detail', this.user$?.value.id]);
    }

    onRouteSetting() {
        this._router.navigate(['/canhan']);
    }

    onRouteSignIn() {
        this._router.navigate(['/sign-in']);
    }

    onRouteResetPassword() {
        this._router.navigate(['/change-password']);
    }

    onRouteTopic() {
        this._router.navigate(['/canhan/chude'])
    }

    onRegisAuthor() {
        this.http
        .postWithParams(UserURL.registerAuthor(), {userId: this.user.id})
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((res: any) => {
            if (!res || !res.state){
                this.messageService.showErrorMessage('Thông báo', res.message);
                return;
            }
            this.messageService.showSuccessMessage('Thông báo', res.message);
            this.store.dispatch({
                type: APP_ACTION.USER_INFO,
                payload: res.data,
            });
        });
    }

    /**
     * Sign out
     */
    signOut(): void {
        this._router.navigate(['/sign-out']);
    }
}
