import { API } from "environments/environment.prod";

export class CommentURL {
    static saveChapterComment() {
        return `${API.BE}/api/v1/comment/chapter/save`
    }

    static getChapterComment() {
        return `${API.BE}/api/v1/comment/unauth/chapter/list-comment`
    }

    static savePostComment() {
        return `${API.BE}/api/v1/comment/post/save`
    }

    static getPostComment() {
        return `${API.BE}/api/v1/comment/unauth/post/list-comment`
    }
}
