import { API } from "environments/environment.prod";

export class DashboardURL {
    static getStatisticUserByRole() {
        return `${API.BE}/api/v1/dashboard/user-count-by-role`
    }

    static getStatisticUserByCreatedate(year) {
        return `${API.BE}/api/v1/dashboard/user-count-by-createdate/${year}`
    }

    static getStatisticBookByTopic() {
        return `${API.BE}/api/v1/dashboard/book-count-by-topic`
    }

    static getStatisticBookByCreatedate(year) {
        return `${API.BE}/api/v1/dashboard/book-count-by-createdate/${year}`
    }

    static getCountBookWaitApprove() {
        return `${API.BE}/api/v1/dashboard/approve-wait-book-count`
    }

    static getCountBookSell() {
        return `${API.BE}/api/v1/dashboard/selling-book-count`
    }
}
