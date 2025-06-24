import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonApiService } from 'app/services/commonHttp';
import { TopicURL } from 'app/services/topic/topic';
import { ConfirmationService } from 'app/shared/confirmation.service';
import { MessageService } from 'app/shared/message.services';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-danhsachchude',
    templateUrl: './danhsachchude.component.html',
    styleUrls: ['./danhsachchude.component.scss']
})
export class DanhsachchudeComponent {
    listTopic: any[]

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private _matDialog: MatDialog,
        private http: CommonApiService,
        private router: Router
    ) {

    }

    ngOnInit(): void {
        this.loadData();
    }

    loadData() {
        this.http
            .get(TopicURL.getListByAdmin())
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res: any) => {
                if (!res) return;
                this.listTopic = res.data;
                this.listTopic.forEach(topic => {
                    topic.isEdit = false
                    topic.createDate = new Date(topic.createDate)
                })
            });
    }

    onSave(valid) {
        const dialogRef = this.confirmationService.showWarningMessage('Xác nhận', 'Bạn có muốn lưu thông tin cập nhật không?');

        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe((result) => {
            if (result == 'confirmed') {
                this.http
                    .post(TopicURL.save(), this.listTopic)
                    .pipe(takeUntil(this._unsubscribeAll))
                    .subscribe((res: any) => {
                        if (!res || !res.state) {
                            this.messageService.showErrorMessage('Thông báo', 'Lưu thông tin chủ đề không thành công');
                            return;
                        }
                        this.messageService.showSuccessMessage('Thông báo', 'Lưu thông tin chủ đề thành công');
                        this.loadData()
                    });
            }
        })
    }

    addThanhPhan() {
        var _newRow = {
            id: null,
            name: '',
            createDate: new Date(),
            isDeleted: null,
            isEdit: true,
        };
        this.listTopic.push(_newRow);
    }

    onRowEditInit(chapter, index) {
        if (chapter.id != null) {
            chapter.isEdit = !chapter.isEdit;
        }
    }

    onRowUpdate(chude, index) {
        if (chude.name == null) {
            this.messageService.showErrorMessage('Thông báo', 'Vui lòng nhập tên chủ đề');
            return
        }
        if (chude.code == null) {
            this.messageService.showErrorMessage('Thông báo', 'Vui lòng nhập mã chủ đề');
            return
        }
        this.http
        .post(TopicURL.save(), chude)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((res: any) => {
            if (!res || !res.state) {
                this.messageService.showErrorMessage('Thông báo', 'Lưu thông tin chủ đề không thành công');
                return;
            }
            this.messageService.showSuccessMessage('Thông báo', 'Lưu thông tin chủ đề thành công');
            chude.isEdit = !chude.isEdit
            this.loadData()
        });
    }

    onRowDeleteInit(chapter, index) {
        const dialogRef = this.confirmationService.showWarningMessage('Xác nhận', 'Bạn có muốn chủ đề ' + chapter.name + ' không?');

        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe((result) => {
            if (result == 'confirmed') {
                if (chapter.id == null) {
                    this.listTopic.splice(index, 1)
                } else {
                    chapter.isDeleted = true
                }
            }
        })
    }

    getSeverity(isDeleted: boolean) {
        switch (isDeleted) {
            case true:
                return 'danger';

            default:
                return 'infor'
        }
    }
}
