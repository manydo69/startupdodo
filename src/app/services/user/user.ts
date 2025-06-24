import { API } from "environments/environment.prod";

export class UserURL {
    static searchByName(): string {
        return `${API.BE}/api/v1/user/unauth/search`
    }
    static banUser(): string {
        return `${API.BE}/api/v1/user/ban-user`
    }
    static unbanUser(): string {
        return `${API.BE}/api/v1/user/unban-user`
    }
    static grantAdmin(): string {
        return `${API.BE}/api/v1/user/grant-admin`
    }
    static getListUserByAdmin(): string {
        return `${API.BE}/api/v1/user/list`
    }
    static getDetailInfo(id) {
        return `${API.BE}/api/v1/user/unauth/detail/${id}`
    }

    static getMyInfo() {
        return `${API.BE}/api/v1/user/me`
    }

    static updateInfo() {
        return `${API.BE}/api/v1/user/updateInfo`
    }

    static registerAuthor() {
        return `${API.BE}/api/v1/user/register-author`
    }
}
