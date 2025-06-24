import { API } from "environments/environment.prod";

export class ReportCategoryURL {
    static getList() {
        return `${API.BE}/api/v1/reportcategory/unauth/list`
    }
    static getListByAdmin() {
        return `${API.BE}/api/v1/reportcategory/list-by-admin`
    }
    static save() {
        return `${API.BE}/api/v1/reportcategory/save`
    }
}
