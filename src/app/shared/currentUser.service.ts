import { Injectable } from "@angular/core";
import { AuthService } from "app/core/auth/auth.service";
import { Observable, of, switchMap } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CurrentUserService {
    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService
    ) { }

    _checkLogin(): Observable<boolean>
    {
        // Check the authentication status
        return this._authService.check()
                   .pipe(
                       switchMap((authenticated) => {

                           // If the user is not authenticated...
                           if ( !authenticated )
                           {
                               // Prevent the access
                               return of(false);
                           }

                           // Allow the access
                           return of(true);
                       })
                   );
    }
}
