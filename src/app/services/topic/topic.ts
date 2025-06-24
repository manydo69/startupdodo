import { API } from "environments/environment.prod";

export class TopicURL {
    static getListByAdmin() {
        return `${API.BE}/api/v1/topic/list-by-admin`
    }
    static save() {
        return `${API.BE}/api/v1/topic/save`
    }
    static getListTopic() {
        return `${API.BE}/api/v1/topic/unauth/list`
    }
    static getListTopicFollow() {
        return `${API.BE}/api/v1/topic/list-follow`
    }
    static getListTopicNotFollow() {
        return `${API.BE}/api/v1/topic/list-not-follow`
    }
    static followTopic() {
        return `${API.BE}/api/v1/topic/follow`
    }
    static unFollowTopic() {
        return `${API.BE}/api/v1/topic/unfollow`
    }
}
