import { Injectable } from "@angular/core";
import { FuseConfirmationService } from "@fuse/services/confirmation";
import { ShareData } from "app/shared/shareservice.service";

@Injectable({
    providedIn: 'root'
})
export class ConfirmationService {
    /**
     * Constructor
     */
    constructor(private _fuseConfirmationService: FuseConfirmationService) { }

    showSuccessConfirm(strTitle, strMess) {
        const dialogRef = this._fuseConfirmationService.open({
            title: strTitle,
            message: strMess,
            icon: {
                color: 'success',
            },
            actions: {
                confirm: {
                    color: 'primary',
                    label: 'Đồng ý'
                },
                cancel: {
                    label: 'Hủy bỏ'
                }
            }
        });
        return dialogRef;
    }

    showErrorConfirm(strTitle, strMess) {
        const dialogRef = this._fuseConfirmationService.open({
            title: strTitle,
            message: strMess,
            icon: {
                color: 'error',
            },
            actions: {
                confirm: {
                    color: 'primary',
                    label: 'Đồng ý'
                },
                cancel: {
                    label: 'Hủy bỏ'
                }
            }
        });
        return dialogRef;
    }

    showWarningMessage(strTitle, strMess) {
        const dialogRef = this._fuseConfirmationService.open({
            title: strTitle,
            message: strMess,
            icon: {
                color: 'warning',
            },
            actions: {
                confirm: {
                    color: 'primary',
                    label: 'Đồng ý'
                },
                cancel: {
                    label: 'Hủy bỏ'
                }
            }
        });
        return dialogRef;
    }

    showInfoMessage(strTitle, strMess) {
        const dialogRef = this._fuseConfirmationService.open({
            title: strTitle,
            message: strMess,
            icon: {
                color: 'info',
            },
            actions: {
                confirm: {
                    color: 'primary',
                    label: 'Đồng ý'
                },
                cancel: {
                    label: 'Hủy bỏ'
                }
            }
        });
        return dialogRef;
    }

}
