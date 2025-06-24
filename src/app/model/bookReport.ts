export interface I_BOOK_REPORT {
    id?: number;
    user?: number;
    book?: number;
    category?: number;
    content?: string;
    status?: string;
    createDate?: Date;
    createUser?: string;
    isDeleted?: boolean;
}

export class BOOK_REPORT implements I_BOOK_REPORT {
    constructor() {}
    id?: number;
    user?: number;
    book?: number;
    category?: number;
    content?: string;
    status?: string;
    createDate?: Date;
    createUser?: string;
    isDeleted?: boolean;
}
