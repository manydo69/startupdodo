import { API } from "environments/environment.prod";

export class BookSavingURL {
    static save() {
        return `${API.BE}/api/v1/book-saving/save`
    }

    static unSave(bookId) {
        return `${API.BE}/api/v1/book-saving/delete/${bookId}`
    }
}
