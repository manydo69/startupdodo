export interface I_BOOK {
    id?: number;
    name?: string;
    coverImage?: string;
    description?: string;
    user?: number;
    author?: string;
    status?: string;
    coinCost?: number;
    enabled?: boolean;
    createDate?: Date;
    isDeleted?: boolean;
    listTopic?: any[];
    listChapter?: any[];
}

export class BOOK implements I_BOOK {
    constructor() {}
    id?: number;
    name?: string;
    coverImage?: string;
    description?: string;
    user?: number;
    author?: string;
    status?: string;
    coinCost?: number;
    enabled?: boolean;
    createDate?: Date;
    isDeleted?: boolean;
    listTopic?: any[];
    listChapter?: any[];
}
