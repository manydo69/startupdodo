import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
    selector: 'app-confirmation-result',
    templateUrl: './confirmation-result.component.html',
    styleUrls: ['./confirmation-result.component.scss']
})
export class ConfirmationResultComponent implements OnInit {
    verificationToken: string;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    showAlert: boolean = false;

    constructor(
        private _authService: AuthService,
        private route: ActivatedRoute,
        private _router: Router
    ) { }

    ngOnInit(): void {
        this.verificationToken = this.route.snapshot.queryParamMap.get('token');
    }

    verifyEmail() {
        this._authService.verifyEmail({ token: this.verificationToken })
            .subscribe(
                (response) => {
                    if (response.state) {
                        // Navigate to the confirmation required page
                        this._router.navigateByUrl('/sign-in');
                    } else {
                        this.alert = {
                            type: 'error',
                            message: response.message
                        };

                        // Set the alert
                        this.alert = {
                            type: 'error',
                            message: 'Đã xảy ra lỗi. Hãy thử lại.'
                        };

                        // Show the alert
                        this.showAlert = true;
                    }

                })
    }

}
