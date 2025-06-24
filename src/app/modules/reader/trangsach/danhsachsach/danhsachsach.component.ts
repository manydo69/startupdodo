import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BookURL } from 'app/services/book/book';
import { CommonApiService } from 'app/services/commonHttp';
import { TopicURL } from 'app/services/topic/topic';
import { ReadHistoryURL } from 'app/services/user/userReadHistory';
import { ConfirmationService } from 'app/shared/confirmation.service';
import { BOOK_FILTER_LIST } from 'app/shared/constant';
import { MessageService } from 'app/shared/message.services';
import { NotificationService } from 'app/shared/notification.service';
import { API } from 'environments/environment.prod';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-danhsachsach',
    templateUrl: './danhsachsach.component.html',
    styleUrls: ['./danhsachsach.component.scss']
})
export class DanhsachsachComponent implements OnInit, OnDestroy {
    topicFilters: any[] = []
    sortFilters: string = null;
    nameFilter: string = '';
    authorFilter: string = '';
    totalNum: number = 0;
    sortOrder: boolean = true;

    listBook: any[]
    specialBook: any[]
    listTopic: any[]
    listSort: any[]

    lastRead: any;
    readLastChapter: boolean = false;
    firebaseToken: any;

    ApiImage: string = API.IMG;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
        private http: CommonApiService,
        private notificationService: NotificationService,
    ) {
        this.notificationService.pushNotifyToken$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((response: string) => {
            if (!response) return;
            this.firebaseToken = response;
        });
    }
    ngOnInit(): void {
        this.listSort = BOOK_FILTER_LIST
        this.http
            .get(
                TopicURL.getListTopic()
            )
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res: any) => {
                if (!res) return;
                this.listTopic = res.data;

            });
        this.http
            .getWithParams(
                ReadHistoryURL.getLastChapterRead(),
                { deviceToken: this.firebaseToken }
            )
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res: any) => {
                if (!res) return;
                this.lastRead = res.data;
                if (this.lastRead) {
                    this.readLastChapter = true;
                }
            });
        this.loadBooks(0);
    }

    loadBooks(pageNo) {
        let params = new HttpParams();
        if (this.topicFilters && this.topicFilters.length > 0) {
            params = params.set('topics', this.topicFilters.join(','))
        }
        if (this.sortFilters) {
            params = params.set('sorting', this.sortFilters)
        }
        if (this.sortOrder != null) {
            params = params.set('sortOrder', this.sortOrder)
        }
        if (this.nameFilter) {
            params = params.set('name', this.nameFilter)
        }
        params = params.set('pageNo', pageNo)
        console.log(params);

        this.http
            .getWithParams(
                BookURL.getAllFilter(), params
            )
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res: any) => {
                if (!res) return;
                this.listBook = res.data.books;
                this.totalNum = res.data.totalNum
            });
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
