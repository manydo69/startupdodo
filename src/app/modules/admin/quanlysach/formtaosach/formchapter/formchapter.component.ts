import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonApiService } from 'app/services/commonHttp';
import { FileUpload } from 'primeng/fileupload';
import { MessageService } from 'app/shared/message.services';
import { ConfirmationService } from 'app/shared/confirmation.service';
import { AppUltil } from 'app/shared/AppUtils';
import { STATUS, CHAPTER_TYPE } from 'app/shared/constant';
import { BookURL } from 'app/services/book/book';
import { Subject, takeUntil } from 'rxjs';
@Component({
    selector: 'app-formchapter',
    templateUrl: './formchapter.component.html',
    styleUrls: ['./formchapter.component.scss']
})
export class FormchapterComponent implements OnInit {
    sourceData: any;

    //file
    uploadedFiles: any[] = [];
    insertFiles: any[] = []
    _fileForm: any;
    file: File;

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public matDialogRef: MatDialogRef<FormchapterComponent>,
        private http: CommonApiService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
    ) {

    }
    ngOnInit(): void {
        this.sourceData = JSON.parse(JSON.stringify(this.data))
        if (this.data.files == null) {
            this.data.files = []
        }
    }

    saveAndClose(): void {
        // this.data.files = this.listFileChapter;

        this.insertFiles.forEach(file => {
            AppUltil.getBase64ImageFromFile(file)
                .then((base64data) => {
                    let sourceImage = base64data;
                    let f = {
                        id: null,
                        chapterId: this.data.id,
                        order: file.order,
                        content: sourceImage,
                        fileName: file.name,
                        fileSize: file.size,
                        fileType: file.type
                    }
                    // this.listFileChapter.push(f)
                    this.data.files.push(f)
                });
        })
        this.matDialogRef.close(this.data);
    }

    close(): void {
        this.matDialogRef.close(this.sourceData);
    }

    // File funct
    upload(event, fileForm) {
        console.log('form');

        this.myUploader(event, fileForm)
        var fd = new FormData();
        fd.append('file', event.files[0]);
        fileForm.clear();
    }

    async myUploader(event, fileForm) {
        let listFileSelect = event.currentFiles;
        for (let i = 0; i < listFileSelect.length; i++) {
            listFileSelect[i].order = i + 1;
            this.insertFiles.push(listFileSelect[i])
        }
        this.uploadedFiles.push(event);
        this._fileForm = fileForm;
    }

    deleteFile(file) {
        const dialogRef = this.confirmationService.showWarningMessage('Xác nhận', 'Bạn có muốn xóa file đính kèm không?');

        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe((result) => {
            if (result == 'confirmed') {
                if (file.id == null) {
                    let index = this.data.files.findIndex(item => item === file);
                    if (index !== -1) {
                        this.data.files.splice(index, 1);
                    }
                }
                file.isDeleted = true;
            }
        });
    }

    removeFile(item: any, uploader: FileUpload, event: Event) {
        const index = uploader.files.indexOf(item);
        this.insertFiles = this.insertFiles.filter((element) => { return element != item });
        uploader.remove(event, index);
        this.uploadedFiles.push(event);
    }

    removeAllFiles(event: Event) {
        this.insertFiles = []
        this.uploadedFiles.push(event)
    }


}
