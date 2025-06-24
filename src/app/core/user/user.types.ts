export interface User
{
    id: number;
    username: string;
    name: string;
    email: string;
    avatar?: string;
    status?: string;
    roles?: any[];
}
