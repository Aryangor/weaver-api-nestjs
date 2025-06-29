export type TJwtPayload = {
    sub: number; // User ID
    email: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
};
