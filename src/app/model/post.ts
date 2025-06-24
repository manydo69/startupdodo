export interface I_POST {
    id?: number;
    user?: number;
    title?: string;
    description?: string;
    content?: string;
    enabled?: boolean;
    createDate?: Date;
    updateDate?: Date;
    createUser?: string;
    updateUser?: string;
    savingCount?: number;
    isSaved?: boolean;
    isDeleted?: boolean;
}

export class POST implements I_POST {
    constructor() {}
    id?: number;
    user?: number;
    title?: string;
    description?: string;
    content?: string;
    enabled?: boolean;
    createDate?: Date;
    updateDate?: Date;
    createUser?: string;
    updateUser?: string;
    savingCount?: number;
    isSaved?: boolean;
    isDeleted?: boolean;
}
