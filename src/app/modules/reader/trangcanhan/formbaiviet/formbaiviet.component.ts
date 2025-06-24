import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonApiService } from 'app/services/commonHttp';
import { PostURL } from 'app/services/post/post';
import { ConfirmationService } from 'app/shared/confirmation.service';
import { MessageService } from 'app/shared/message.services';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-formbaiviet',
  templateUrl: './formbaiviet.component.html',
  styleUrls: ['./formbaiviet.component.scss']
})
export class FormbaivietComponent {
    sourceData: any = {};

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public matDialogRef: MatDialogRef<FormbaivietComponent>,
        private http: CommonApiService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
    ) {

    }
    ngOnInit(): void {
        if (this.data)
            this.sourceData = JSON.parse(JSON.stringify(this.data))
    }

    saveAndClose(): void {
        console.log();

        const dialogRef = this.confirmationService.showWarningMessage('Xác nhận', 'Bạn có muốn đăng bài viết?');

        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe((result) => {
            if (result == 'confirmed') {
                this.http
                    .post(PostURL.save(), this.sourceData)
                    .pipe(takeUntil(this._unsubscribeAll))
                    .subscribe((res: any) => {
                        if (!res || !res.state) {
                            this.messageService.showErrorMessage('Thông báo', res.message);
                            return;
                        }
                        this.messageService.showSuccessMessage('Thông báo', res.message);
                        this.matDialogRef.close(res);
                    });
            }
        });
    }

    close(): void {
        this.matDialogRef.close();
    }

}
