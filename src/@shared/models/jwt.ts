export type TJwtPayload = {
    sub: number; // User ID
    exp?: number; // Expiration time in seconds since epoch
    email: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
};
