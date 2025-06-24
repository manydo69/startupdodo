export interface I_GOLD_EXCHANGE {
    id?: number;
    gold?: number;
    bankCode?: string;
    bankAccount?: string;
}

export class GOLD_EXCHANGE implements I_GOLD_EXCHANGE {
    constructor() {}
    id?: number;
    gold?: number;
    bankCode?: string;
    bankAccount?: string;
}
