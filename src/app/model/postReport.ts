export interface I_POST_REPORT {
    id?: number;
    user?: number;
    post?: number;
    reason?: string;
    status?: string;
    createDate?: Date;
    createUser?: string;
    isDeleted?: boolean;
}

export class POST_REPORT implements I_POST_REPORT {
    constructor() {}
    id?: number;
    user?: number;
    book?: number;
    reason?: string;
    status?: string;
    createDate?: Date;
    createUser?: string;
    isDeleted?: boolean;
}
