import { API } from "environments/environment.prod";

export class PostReportURL {
    static getListByAdmin() {
        return `${API.BE}/api/v1/postreport/list-report`
    }
    static save() {
        return `${API.BE}/api/v1/postreport/save`
    }
    static approveReport() {
        return `${API.BE}/api/v1/postreport/approve-report`
    }
    static refuseReport() {
        return `${API.BE}/api/v1/postreport/refuse-report`
    }
}
