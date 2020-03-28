export interface Authentication {
    user: {
        id: number,
        email: string,
        username: string,
        password: string
    };
    access_token: string;
    expires_in: number;
}
