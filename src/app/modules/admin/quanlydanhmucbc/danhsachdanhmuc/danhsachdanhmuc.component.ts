import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonApiService } from 'app/services/commonHttp';
import { ReportCategoryURL } from 'app/services/report/reportcategory';
import { ConfirmationService } from 'app/shared/confirmation.service';
import { MessageService } from 'app/shared/message.services';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-danhsachdanhmuc',
  templateUrl: './danhsachdanhmuc.component.html',
  styleUrls: ['./danhsachdanhmuc.component.scss']
})
export class DanhsachdanhmucComponent {
    listReportCategory: any[]

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
            .get(ReportCategoryURL.getListByAdmin())
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res: any) => {
                if (!res) return;
                this.listReportCategory = res.data;
                this.listReportCategory.forEach(topic => {
                    topic.isEdit = false
                    topic.createDate = new Date(topic.createDate)
                })
            });
    }

    addThanhPhan() {
        var _newRow = {
            id: null,
            content: '',
            createDate: new Date(),
            isDeleted: null,
            isEdit: true,
        };
        this.listReportCategory.push(_newRow);
    }

    onRowEditInit(chapter, index) {
        if (chapter.id != null) {
            chapter.isEdit = !chapter.isEdit;
        }
    }

    onRowDeleteInit(chapter, index) {
        const dialogRef = this.confirmationService.showWarningMessage('Xác nhận', 'Bạn có muốn danh mục báo cáo không?');

        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe((result) => {
            if (result == 'confirmed') {
                if (chapter.id == null) {
                    this.listReportCategory.splice(index, 1)
                } else {
                    chapter.isDeleted = true
                }
            }
        })
    }

    onRowUpdate(product, index) {
        if (product.content == null) {
            this.messageService.showErrorMessage('Thông báo', 'Vui lòng nhập loại vi phạm');
            return
        }
        this.http
        .post(ReportCategoryURL.save(), product)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((res: any) => {
            if (!res || !res.state) {
                this.messageService.showErrorMessage('Thông báo', 'Lưu thông tin danh mục báo cáo không thành công');
                return;
            }
            this.messageService.showSuccessMessage('Thông báo', 'Lưu thông tin danh mục báo cáo thành công');
            this.loadData()
        });
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
