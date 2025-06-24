import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { Subject, finalize, takeUntil } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { HttpParams } from '@angular/common/http';

@Component({
    selector: 'auth-forgot-password',
    templateUrl: './forgot-password.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AuthForgotPasswordComponent implements OnInit {
    @ViewChild('forgotPasswordNgForm') forgotPasswordNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    forgotPasswordForm: UntypedFormGroup;
    showAlert: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.forgotPasswordForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            name: ['', [Validators.required]]
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Send the reset link
     */
    sendResetLink(): void {
        // Return if the form is invalid
        if (this.forgotPasswordForm.invalid) {
            return;
        }

        // Disable the form
        this.forgotPasswordForm.disable();

        // Hide the alert
        this.showAlert = false;

        // let body = new HttpParams();
        // body.set('userEmail', this.forgotPasswordForm.get('email').value);
        // body.set('userName', this.forgotPasswordForm.get('name').value);

        // Forgot password
        this._authService.forgotPassword({ email: this.forgotPasswordForm.get('email').value, userName: this.forgotPasswordForm.get('name').value })
            .pipe(takeUntil(this._unsubscribeAll), finalize(() => {

                // Re-enable the form
                this.forgotPasswordForm.enable();

                // Reset the form
                this.forgotPasswordNgForm.resetForm();

                // Show the alert
                this.showAlert = true;
            }))
            .subscribe((result) => {
                if (!result || !result.state) {
                    this.alert = {
                        type: 'error',
                        message: 'Không tìm thấy email. Bạn có chắc đã đăng ký tài khoản email này?'
                    };
                } else {
                    this.alert = {
                        type: 'success',
                        message: 'Yêu cầu đổi mật khẩu đã được gửi! Bạn sẽ nhận được link đổi mật khẩu trong thư.'
                    };
                }
            })
    }
}
