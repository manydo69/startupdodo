import { API } from "environments/environment.prod";

export class BookReportURL {
    static getListByAdmin() {
        return `${API.BE}/api/v1/bookreport/list-report`
    }
    static save() {
        return `${API.BE}/api/v1/bookreport/save`
    }
    static approveReport() {
        return `${API.BE}/api/v1/bookreport/approve-report`
    }
    static refuseReport() {
        return `${API.BE}/api/v1/bookreport/refuse-report`
    }
}
