import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { BookURL } from 'app/services/book/book';
import { CommonApiService } from 'app/services/commonHttp';
import { DEVICE_TYPE } from 'app/shared/constant';
import { API } from 'environments/environment.prod';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit, OnDestroy {
    widthOff: any;
    deviceType: any;
    numberLoadPaginator: number;

    listBookNew: any[] = []
    listBookBestRating: any[] = []
    listBookBestRatingSlice: any[]
    listBookMostSaved: any[]=[]
    listBookMostSavedSlice: any[]
    responsiveOptions: any;

    ApiImage: string = API.IMG;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
        private http: CommonApiService,
    ) {

    }

    @HostListener('window:resize', ['$event'])
    onWindowResize() {
        this.onChangeWidthSize()

    }

    ngOnInit(): void {
        this.responsiveOptions = [
            {
                breakpoint: '768px',
                numVisible: 1,
                numScroll: 1
            },
            {
                breakpoint: '1024px',
                numVisible: 2,
                numScroll: 1
            },
            {
                breakpoint: '1200px',
                numVisible: 4,
                numScroll: 2
            },
        ];
        this.http
            .getWithParams(
                BookURL.getListBookNew(), null
            )
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res: any) => {
                if (!res) return;
                this.listBookNew = res.data;
            });

        this.http
            .getWithParams(
                BookURL.getListBookBestRating(), null
            )
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res: any) => {
                if (!res) return;
                this.listBookBestRating = res.data;
                this.listBookBestRatingSlice = this.listBookBestRating.slice(0, this.numberLoadPaginator)
            });

        this.http
            .getWithParams(
                BookURL.getListBookMostSaved(), null
            )
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res: any) => {
                if (!res) return;
                this.listBookMostSaved = res.data;
                this.listBookMostSavedSlice = this.listBookMostSaved.slice(0, this.numberLoadPaginator)
            });
        this.onChangeWidthSize()
    }

    onPageChange(event) {
        this.listBookBestRatingSlice = this.listBookBestRating.slice(event.first, event.first + this.numberLoadPaginator)
    }

    onPageChangeBookSaved(event) {
        this.listBookMostSavedSlice = this.listBookMostSaved.slice(event.first, event.first + this.numberLoadPaginator)
    }

    onChangeWidthSize() {
        this.widthOff = window.innerWidth;
        if (this.widthOff < 768) {
            this.deviceType = DEVICE_TYPE.MOBILE;
            this.numberLoadPaginator = 2
        } else if (this.widthOff < 1024) {
            this.deviceType = DEVICE_TYPE.TABLET
            this.numberLoadPaginator = 3
        } else {
            this.deviceType = DEVICE_TYPE.PC;
            this.numberLoadPaginator = 6
        }
        this.listBookBestRatingSlice = this.listBookBestRating.slice(0, this.numberLoadPaginator)
        this.listBookMostSavedSlice = this.listBookMostSaved.slice(0, this.numberLoadPaginator)
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
