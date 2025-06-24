import { Component } from '@angular/core';
import { AppConfig } from 'app/core/config/app.config';
import { CommonApiService } from 'app/services/commonHttp';
import { DashboardURL } from 'app/services/dashboard';
import { TopicURL } from 'app/services/topic/topic';
import { Subject, Subscription, takeUntil } from 'rxjs';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
    userRole: any;
    chartOptions: any;

    userNewCreate: any;
    userNewCreateYear;
    userNewCreateChartOptions: any;

    listTopic: any[];
    bookByTopicStatistic;
    bookNewCreate;

    countBookWaitApprove: number = 0;
    countBookSell: number = 0;

    subscription: Subscription;

    config: AppConfig;

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
        private http: CommonApiService,
    ) { }

    ngOnInit() {
        this.userNewCreateChartOptions = {
            maintainAspectRatio: false,
            aspectRatio: 1.2,
            scales: {
                x: {
                    ticks: {
                        font: {
                            weight: 500
                        }
                    },
                    grid: {
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                    },
                    grid: {
                        drawBorder: false
                    }
                }

            }
        };
        this.getStatisticUserByRole()
        this.getStatisticUserByCreateDate((new Date()).getFullYear());
        this.getStatisticBookByTopic()
        this.getStatisticBookByCreateDate((new Date()).getFullYear())
    }

    getStatisticUserByRole() {
        this.http
            .get(DashboardURL.getStatisticUserByRole())
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res: any) => {
                if (!res) return;
                this.userRole = {
                    labels: ['Độc giả', 'Tác giả', 'Quản lý'],
                    datasets: [
                        {
                            data: [res.data.reader, res.data.author, res.data.admin],
                            backgroundColor: [
                                "#FF6384",
                                "#36A2EB",
                                "#FFCE56"
                            ],
                            hoverBackgroundColor: [
                                "#FF6384",
                                "#36A2EB",
                                "#FFCE56"
                            ]
                        }
                    ]
                };
            });
    }

    getStatisticUserByCreateDate(year) {
        this.http
            .get(DashboardURL.getStatisticUserByCreatedate(year))
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res: any) => {
                if (!res) return;
                let data = [];
                let months = res.data.map(item => item.month);
                for (let i = 1; i <= 12; i++) {
                    if (months.includes(i)) {
                        data.push(res.data[i - 1].amount)
                    } else {
                        data.push(0)
                    }
                }
                this.userNewCreate = {
                    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',],
                    datasets: [
                        {
                            label: "Người dùng mới",
                            data: data,
                            backgroundColor: [
                                "#36A2EB",
                            ],
                            hoverBackgroundColor: [
                                "#36A2EB",
                            ]
                        }
                    ]
                };
            });
    }

    getStatisticBookByTopic() {
        this.http
            .get(DashboardURL.getStatisticBookByTopic())
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res: any) => {
                if (!res) return;
                let data = res.data.map(item => item.amount)
                let label = res.data.map(item => item.type)
                this.bookByTopicStatistic = {
                    labels: label,
                    datasets: [
                        {
                            data: data,
                            backgroundColor: [
                                "#FF6384",
                                "#36A2EB",
                                "#FFCE56",
                                "#42A5F5",
                                "#495057",
                                "#FFA726"
                            ],
                            hoverBackgroundColor: [
                                "#FF6384",
                                "#36A2EB",
                                "#FFCE56",
                                "#42A5F5",
                                "#495057",
                                "#FFA726"
                            ]
                        }
                    ]
                };
            });
    }

    getStatisticBookByCreateDate(year) {
        this.http
            .get(DashboardURL.getStatisticBookByCreatedate(year))
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res: any) => {
                if (!res) return;
                let data = [];
                let months = res.data.map(item => item.month);
                for (let i = 1; i <= 12; i++) {
                    if (months.includes(i)) {
                        data.push(res.data[i - 1].amount)
                    } else {
                        data.push(0)
                    }
                }
                this.bookNewCreate = {
                    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',],
                    datasets: [
                        {
                            label: "Sách mới",
                            data: data,
                            backgroundColor: [
                                "#FF6384",
                                "#36A2EB",
                                "#FFCE56"
                            ],
                            hoverBackgroundColor: [
                                "#FF6384",
                                "#36A2EB",
                                "#FFCE56"
                            ]
                        }
                    ]
                };
            });
    }

    getCountBookWaitApprove() {
        this.http
            .get(DashboardURL.getCountBookWaitApprove())
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res: any) => {
                if (!res) return;
                this.countBookWaitApprove = res.data
            })
    }

    getCountBookSell() {
        this.http
            .get(DashboardURL.getCountBookSell())
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res: any) => {
                if (!res) return;
                this.countBookSell = res.data
            })
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
