import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { API } from 'environments/environment.prod';
import { CommonApiService } from 'app/services/commonHttp';
import { CommonURL } from 'app/services/commonUrl';
import { Store } from '@ngrx/store';
import { AppState } from 'app/ngxstore/state/app.state';
import { APP_ACTION } from 'app/ngxstore/actions/app.actions';

@Injectable()
export class AuthService {
    private _authenticated: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService,
        private http: CommonApiService,
        private store: Store<AppState>
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    /**
     * Setter & getter for refresh Token
     */
    set refreshToken(token: string) {
        localStorage.setItem('refreshToken', token);
    }

    get refreshToken(): string {
        return localStorage.getItem('refreshToken') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(body: any): Observable<any> {
        return this.http.postWithParams(CommonURL.forgotPass(), body);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: {newPassword: any; token: string}): Observable<any> {
        return this.http.post(CommonURL.resetPass(), password);
    }

    /**
     * Change password
     *
     * @param password
     */
    changePassword(password: {oldPassword: any; newPassword: any; token: string}): Observable<any> {
        return this.http.post(CommonURL.changePass(), password);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { userId: string; password: string }): Observable<any> {
        // Throw error, if the user is already logged in
        if (this._authenticated) {
            return throwError('User is already logged in.');
        }

        return this._httpClient.post(API.BE + '/api/auth/sign-in', credentials).pipe(
            switchMap((response: any) => {
                if (!response || !response.state)
                    return of(response)

                // Store the access token in the local storage
                this.accessToken = response.token;

                // Store therefresh Token in the local storage
                this.refreshToken = response.refreshToken;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                // this._userService.setUser(response.userInfo)
                this.store.dispatch({
                    type: APP_ACTION.USER_INFO,
                    payload: response.userInfo,
                });
                // this._userService.user = response.userInfo;

                // this._userService.saveUser(response.userInfo)
                // Return a new observable with the response
                return of(response);
            })
        );
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any> {
        // Sign in using the token
        return this._httpClient.post(API.BE + '/api/auth/sign-in-token', {
            accessToken: this.accessToken
        }).pipe(
            catchError(() =>

                // Return false
                of(false)
            ),
            switchMap((response: any) => {

                // Replace the access token with the new one if it's available on
                // the response object.
                //
                // This is an added optional step for better security. Once you sign
                // in using the token, you should generate a new one on the server
                // side and attach it to the response object. Then the following
                // piece of code can replace the token with the refreshed one.
                if (response.accessToken) {
                    this.accessToken = response.token;
                }

                // Store therefresh Token in the local storage
                this.refreshToken = response.refreshToken;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this.store.dispatch({
                    type: APP_ACTION.USER_INFO,
                    payload: {... response.userInfo},
                });
                // this._userService.setUser(response.userInfo)
                // this._userService.user = response.userInfo;
                // this._userService.saveUser(response.userInfo)

                // Return true
                return of(true);
            })
        );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');

        // Remove the access token from the local storage
        localStorage.removeItem('refreshToken');

        // Remove userInfo
        this._userService.clearUser()

        // Set the authenticated flag to false
        this._authenticated = false;

        this._httpClient.post(API.BE + '/api/auth/signout', null);

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: {userName: string; name: string; email: string; password: string; company: string }): Observable<any> {
        // return this._httpClient.post('api/auth/sign-up', user);
        return this.http.post(CommonURL.signUp(), user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any> {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        // Check if the user is logged in
        if (this._authenticated) {
            return of(true);
        }

        // Check the access token availability
        if (!this.accessToken) {
            return of(false);
        }

        // Check the access token expire date
        if (AuthUtils.isTokenExpired(this.accessToken)) {
            return of(false);
        }

        // If the access token exists and it didn't expire, sign in using it
        return this.signInUsingToken();
    }

    verifyEmail(data: {token: string}): Observable<any> {
        return this.http.postWithParams(CommonURL.verifyEmail(), data);
    }
}

