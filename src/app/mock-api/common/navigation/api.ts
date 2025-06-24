import { Injectable, OnInit } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { compactNavigationByRoleAuthor, compactNavigationByRoleQuanLy, compactNavigationByRoleReader, defaultNavigation } from 'app/mock-api/common/navigation/data';
import { UserService } from 'app/core/user/user.service';
import { BehaviorSubject, Observable, ReplaySubject, Subject, takeUntil } from 'rxjs';
import { Navigation } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'app/ngxstore/state/app.state';
import { APP_ACTION } from 'app/ngxstore/actions/app.actions';

@Injectable({
    providedIn: 'root'
})
export class NavigationMockApi {
    private _navigation: ReplaySubject<Navigation> = new ReplaySubject<Navigation>(1);
    private _menuAll: FuseNavigationItem[] = [];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    user: any;
    user$ = new BehaviorSubject<any>({});
    /**
     * Constructor
     */
    constructor(
        private _fuseMockApiService: FuseMockApiService,
        private _userService: UserService,
        private store: Store<AppState>
    ) {
        const appUser = this.store.select((state) => state.appUser);
        appUser.subscribe((res: any) => {
            const data = res;
            if (data && data.type === APP_ACTION.USER_INFO) {
                this.user = { ...data.payload };
                this.registerHandlers();
                this.user$.next(this.user);
            }
        });
        // Register Mock API handlers
        // this.registerHandlers();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void {
        // -----------------------------------------------------------------------------------------------------
        // @ Navigation - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/common/navigation')
            .reply(() => {
                // this.user = this._userService.get();
                this._menuAll = []
                defaultNavigation.forEach(element => {
                    this._menuAll.push(element)
                });
                if (this.user) {
                    const roleQuanly = this.user.roles.find((item: any) => item === 'ADMIN');
                    const roleAuthor = this.user.roles.find((item: any) => item === 'AUTHOR');
                    const roleReader = this.user.roles.find((item: any) => item === 'READER');
                    if (roleQuanly) {
                        this._menuAll.push(...compactNavigationByRoleQuanLy)
                    }
                    if (roleAuthor) {
                        this._menuAll.push(...compactNavigationByRoleAuthor)
                    }
                    if (roleReader) {
                        this._menuAll.push(...compactNavigationByRoleReader)
                    }
                }
                // Return the response
                return [
                    200,
                    {
                        horizontal: this._menuAll,
                        futuristic: [],
                        default: this._menuAll,
                        compact: []
                    }
                ];
            });
    }
}
