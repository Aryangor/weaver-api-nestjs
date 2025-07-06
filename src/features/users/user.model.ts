export class UserModel {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    role: 'admin' | 'user';
    is_active: boolean;
    last_login?: Date;
    created_at?: Date;
    updated_at?: Date;
}
