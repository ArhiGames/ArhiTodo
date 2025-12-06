export type JwtPayload = {
    sub: string;
    unique_name: string;
    email: string;
    nbf: number;
    exp: number;
    iat: number;
    iss: string;
    aud: string;
}