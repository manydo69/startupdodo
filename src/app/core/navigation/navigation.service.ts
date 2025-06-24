import { ApplicationRef, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, ReplaySubject, of, tap } from 'rxjs';
import { Navigation } from 'app/core/navigation/navigation.types';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { AppState } from 'app/ngxstore/state/app.state';
import { Store } from '@ngrx/store';
import { APP_ACTION } from 'app/ngxstore/actions/app.actions';
import { compactNavigationByRoleAuthor, compactNavigationByRoleQuanLy, compactNavigationByRoleReader, defaultNavigation } from 'app/mock-api/common/navigation/data';

@Injectable({
    providedIn: 'root'
})
export class NavigationService
{
    private _navigation: ReplaySubject<Navigation> = new ReplaySubject<Navigation>(1);
    private _menuAll: FuseNavigationItem[] = null;
    user: any;
    user$ = new BehaviorSubject<any>({});
    /**
     * Constructor
     */
    constructor(
        private store: Store<AppState>,
    ) {
        this._menuAll = []
        this._menuAll.push(...defaultNavigation)
        const appUser = this.store.select((state) => state.appUser);
        appUser.subscribe((res: any) => {
            const data = res;
            if (data && data.type === APP_ACTION.USER_INFO) {
                this.user = { ...data.payload };
                this._menuAll = []
                defaultNavigation.forEach(element => {
                    this._menuAll.push(element)
                });
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
                this.user$.next(this.user);
                console.log('b', this.user);
                console.log('c', this._menuAll);
                let navi: Navigation = {
                    horizontal: this._menuAll,
                    futuristic: [],
                    default: this._menuAll,
                    compact: []
                }
                this._navigation.next(navi);
            }
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for navigation
     */
    get navigation$(): Observable<Navigation> {
        return this._navigation.asObservable();
    }

    /**
 * Get all navigation data
 */
    get(): Observable<Navigation> {
        let navi: Navigation = {
            horizontal: this._menuAll,
            futuristic: [],
            default: this._menuAll,
            compact: []
        }
        const obsof3 = of(navi);
        return obsof3.pipe(
            tap((navigation) => {
                this._navigation.next(navigation);
            })
        );
    }

}
