export interface I_CHAPTER {
    id?: number;
    bookId?: number;
    bookName?: string;
    name?: string;
    order?: number;
    content?: string;
    type?: string;
    status?: string;
    coinCost?: number;
    pointCost?: number;
    files?: any[];
    isSaved?: boolean;
}

export class CHAPTER implements I_CHAPTER {
    constructor() {}
    id?: number;
    bookId?: number;
    bookName?: string;
    name?: string;
    order?: number;
    content?: string;
    type?: string;
    status?: string;
    coinCost?: number;
    pointCost?: number;
    files?: any[];
    isSaved?: boolean;
}
