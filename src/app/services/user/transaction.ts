import { API } from "environments/environment.prod";

export class TransactionURL {
    static changePoint(): string {
        return `${API.BE}/api/v1/transaction/change-point`
    }
    static pay(ipAddress, userId, amount) {
        return `${API.BE}/api/v1/transaction/transfer-vnpay/${ipAddress}/${userId}/${amount}`
    }

    static createTransaction() {
        return `${API.BE}/api/v1/transaction/create-transaction`
    }

    static getMyTransaction() {
        return `${API.BE}/api/v1/transaction/list-transaction`
    }

    static changeGold(): string {
        return `${API.BE}/api/v1/transaction/change-gold`
    }

    static createGoldPayment(): string {
        return `${API.BE}/api/v1/transaction/exchange-gold`
    }

    static getAllTransactionByAdmin() {
        return `${API.BE}/api/v1/transaction/list-transaction-admin`
    }
}
