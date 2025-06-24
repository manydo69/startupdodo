import { API } from "environments/environment.prod";

export class BookURL {
    static save() {
        return `${API.BE}/api/v1/book/save`
    }

    static uploadFile() {
        return `${API.BE}/api/v1/book/uploadfile`
    }

    static getAllByAuthorId() {
        return `${API.BE}/api/v1/book/list-book-create`
    }

    static getDetail(id): string {
        return `${API.BE}/api/v1/book/detail/${id}`
    }

    static delete(id): string {
        return `${API.BE}/api/v1/book/delete/${id}`
    }

    static getRatings(id: any): string {
        return `${API.BE}/api/v1/book/unauth/get-ratings/${id}`
    }

    static getChapter(id: any): string {
        return `${API.BE}/api/v1/book/chapter/detail/${id}`
    }

    static getAllFilter() {
        return `${API.BE}/api/v1/book/unauth/list-book-filter`
    }

    static getListBookNew() {
        return `${API.BE}/api/v1/book/unauth/list-book-new`
    }

    static getListBookBestRating() {
        return `${API.BE}/api/v1/book/unauth/list-book-bestrating`
    }

    static getListBookMostSaved() {
        return `${API.BE}/api/v1/book/unauth/list-book-mostsaved`
    }

    static getAllSaving() {
        return `${API.BE}/api/v1/book/list-book-saving`
    }

    static getDetailInfo(id): string {
        return `${API.BE}/api/v1/book/unauth/detail/${id}`
    }

    static getChapterDetailInfo(id): string {
        return `${API.BE}/api/v1/book/unauth/chapter/detail/${id}`
    }

    static getListChapter(bookId): string {
        return `${API.BE}/api/v1/book/unauth/list-chapter/${bookId}`
    }

    static rating(): string {
        return `${API.BE}/api/v1/book/rating`
    }

    static getRatingByUser(bookId): string {
        return `${API.BE}/api/v1/book/ratingdetail/${bookId}`
    }

    static getListBookByAdmin(): string {
        return `${API.BE}/api/v1/book/list-book`
    }

    static approveBook(): string {
        return `${API.BE}/api/v1/book/approve-book`
    }

    static banBook(): string {
        return `${API.BE}/api/v1/book/ban-book`
    }

    static banChapter(): string {
        return `${API.BE}/api/v1/book/ban-chapter`
    }

    static unbanChapter(): string {
        return `${API.BE}/api/v1/book/unban-chapter`
    }

    static buyBook(): string {
        return `${API.BE}/api/v1/book/buy-book`
    }

    static buyChapter(): string {
        return `${API.BE}/api/v1/book/buy-chapter`
    }

    static getListBookByAuthor(userId): string {
        return `${API.BE}/api/v1/book/unauth/list-book-create/${userId}`
    }

}
