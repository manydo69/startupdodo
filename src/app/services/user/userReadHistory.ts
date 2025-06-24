import { API } from "environments/environment.prod";

export class ReadHistoryURL {
    static getLastChapterRead(): string {
        return `${API.BE}/api/v1/history/unauth/get-last-read`
    }
    static saveHistory() {
        return `${API.BE}/api/v1/history/unauth/save`
    }
}
