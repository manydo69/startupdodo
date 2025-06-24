import { API, environment } from "environments/environment.prod";

export class CommonURL {

    static login() {
        return `${API.BE}/api/auth/login`
    }

    static refreshToken() {
        return `${API.BE}/api/auth/refresh`
    }

    static inforMe() {
        return `${API.BE}/api/user/me`
    }

    static logout() {
        return `${API.BE}/api/user/logout`
    }

    static forgotPass() {
        return `${API.BE}/api/auth/forgot-password`
    }
    static resetPass() {
        return `${API.BE}/api/auth/save-password`
    }

    static signUp() {
        return `${API.BE}/api/auth/sign-up`
    }

    static verifyEmail() {
        return `${API.BE}/api/auth/regitrationConfirm`
    }

    static changePass() {
        return `${API.BE}/api/auth/change-password`
    }
}
