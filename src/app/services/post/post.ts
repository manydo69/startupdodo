import { API } from "environments/environment.prod";

export class PostURL {
    static save() {
        return `${API.BE}/api/v1/post/save`
    }

    static getAllByAuthorId(id) {
        return `${API.BE}/api/v1/post/unauth/list-post-create/${id}`
    }

    static getDetail(id): string {
        return `${API.BE}/api/v1/post/detail/${id}`
    }

    static delete(id): string {
        return `${API.BE}/api/v1/post/delete/${id}`
    }

    static getAllFilter() {
        return `${API.BE}/api/v1/post/unauth/list-post-filter`
    }

    static getAllSaving() {
        return `${API.BE}/api/v1/post/list-post-saving`
    }

    static getDetailInfo(id): string {
        return `${API.BE}/api/v1/post/unauth/detail/${id}`
    }

    static getListPostByAdmin(): string {
        return `${API.BE}/api/v1/post/list-post`
    }

    static banPost(): string {
        return `${API.BE}/api/v1/post/ban-post`
    }

    static onUnBanPost(): string {
        return `${API.BE}/api/v1/post/unban-post`
    }
}
