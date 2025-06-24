import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonApiService } from 'app/services/commonHttp';
import { PostURL } from 'app/services/post/post';
import { ConfirmationService } from 'app/shared/confirmation.service';
import { POST_FILTER_LIST, STATUS } from 'app/shared/constant';
import { MessageService } from 'app/shared/message.services';
import { API } from 'environments/environment.prod';
import { SelectItem } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-danhsachbaiviet',
  templateUrl: './danhsachbaiviet.component.html',
  styleUrls: ['./danhsachbaiviet.component.scss']
})
export class DanhsachbaivietComponent implements OnInit, OnDestroy{
    topicFilters: any[] = []
    sortFilters: string = null;
    nameFilter: string = '';
    totalNum: number = 0;
    sortOrderAPI: boolean = true;

    listPost: any[]
    specialBook: any[]
    listTopic: any[]
    listSort: any[]

    sortOptions: SelectItem[];
    sortOrder: number;
    sortField: string;

    ApiImage: string = API.IMG;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
        private router: Router,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private _matDialog: MatDialog,
        private http: CommonApiService,
    ) {

    }
    ngOnInit(): void {
        this.listSort = POST_FILTER_LIST
        this.loadPosts(0);
        this.sortOptions = [
            {label: 'Gần đây nhất', value: '!createDate'},
            {label: 'Lâu nhất', value: 'createDate'}
        ];
    }

    loadPosts(pageNo) {
        let params = new HttpParams();
        if (this.sortFilters) {
            params = params.set('sorting', this.sortFilters)
        }
        if (this.sortOrderAPI != null) {
            params = params.set('sortOrder', this.sortOrderAPI)
        }
        if (this.nameFilter) {
            params = params.set('name', this.nameFilter)
        }
        params = params.set('pageNo', pageNo)
        console.log(params);

        this.http
            .getWithParams(
                PostURL.getAllFilter(), params
            )
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res: any) => {
                if (!res) return;
                this.listPost = res.data.posts;
                this.totalNum = res.data.totalNum
            });
    }

    onPageChange(event) {
        this.loadPosts(event.page)
    }

    onFilter() {
        this.loadPosts(0);
    }

    onSortChange(event) {
        let value = event.value;

        if (value.indexOf('!') === 0) {
            this.sortOrder = -1;
            this.sortField = value.substring(1, value.length);
        }
        else {
            this.sortOrder = 1;
            this.sortField = value;
        }
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
