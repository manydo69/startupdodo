import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { APP_ACTION } from 'app/ngxstore/actions/app.actions';
import { AppState } from 'app/ngxstore/state/app.state';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    /**
     * Constructor
     */
    constructor(
        private store: Store<AppState>) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for user
     *
     * @param value
     */
    // set user(value: User) {
    //     // Store the value
    //     localStorage.setItem('userInfo', JSON.stringify(value));
    // }

    // get user$(): User {
    //     const userString = localStorage.getItem('userInfo');
    //     return userString ? JSON.parse(userString) : null;
    // }

    setUser(user: any): void {
        // this.store.dispatch(UserActions.setUser(user));
        this.store.dispatch({
            type: APP_ACTION.USER_INFO,
            payload: user,
        });
    }

    clearUser(): void {
        this.store.dispatch({
            type: APP_ACTION.USER_INFO,
            payload: null
        });
    }
}
