export interface I_BOOK_RATING {
    id?: number;
    user?: number;
    book?: number;
    rate?: number;
    comment?: string;
}

export class BOOK_RATING implements I_BOOK_RATING {
    constructor() {}
    id?: number;
    user?: number;
    book?: number;
    rate?: number;
    comment?: string;
}
