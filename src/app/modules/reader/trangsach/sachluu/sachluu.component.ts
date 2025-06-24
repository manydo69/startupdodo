import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BookURL } from 'app/services/book/book';
import { CommonApiService } from 'app/services/commonHttp';
import { ConfirmationService } from 'app/shared/confirmation.service';
import { BOOK_FILTER_LIST } from 'app/shared/constant';
import { CurrentUserService } from 'app/shared/currentUser.service';
import { MessageService } from 'app/shared/message.services';
import { API } from 'environments/environment.prod';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-sachluu',
  templateUrl: './sachluu.component.html',
  styleUrls: ['./sachluu.component.scss']
})
export class SachluuComponent implements OnInit, OnDestroy {
    listBook: any[] = []
    sortFilters: string = null;
    totalNum: number = 0;
    sortOrder: boolean = true;
    listSort: any[]

    ApiImage: string = API.IMG;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private _matDialog: MatDialog,
        private http: CommonApiService,
        private currentUserService: CurrentUserService,
        private _router: Router,
    ) {

    }
    ngOnInit(): void {
        this.listSort = BOOK_FILTER_LIST
        this.loadBooks(0);
    }

    loadBooks(pageNo) {
        this.currentUserService._checkLogin().pipe().subscribe(isLogin => {
            if (isLogin) {
                let params = new HttpParams();
                if (this.sortFilters) {
                    params = params.set('sorting', this.sortFilters)
                }
                if (this.sortOrder != null) {
                    params = params.set('sortOrder', this.sortOrder)
                }
                params = params.set('pageNo', pageNo)
                this.http
                    .getWithParams(
                        BookURL.getAllSaving(), params
                    )
                    .pipe(takeUntil(this._unsubscribeAll))
                    .subscribe((res: any) => {
                        if (!res) return;
                        this.listBook = res.data.books;
                        this.totalNum = res.data.totalNum
                    });
            } else {
                const dialogRef = this.confirmationService.showInfoMessage('Xác nhận', 'Bạn chưa đăng nhập. Bạn có muốn đăng nhập để sử dụng đầy đủ tính năng?');

                // Subscribe to afterClosed from the dialog reference
                dialogRef.afterClosed().subscribe(async (result) => {
                    if (result == 'confirmed') {
                        this._router.navigate(['/sign-in',])
                    }
                })
            }
        })
    }

    onPageChange(event) {
        this.loadBooks(event.page)
    }

    onFilter() {
        this.loadBooks(0);
    }

    /**
 * On destroy
 */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();

    }
}
