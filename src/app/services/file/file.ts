import { API } from "environments/environment.prod";

export class FileURL {
    static uploadFile() {
        return `${API.BE}/api/v1/file/uploadfile`
    }
}
