import { API } from "environments/environment.prod";

export class NotifyURL {
    static saveNotificationToken() {
        return `${API.BE}/api/v1/notification/unauth/save`
    }
}
