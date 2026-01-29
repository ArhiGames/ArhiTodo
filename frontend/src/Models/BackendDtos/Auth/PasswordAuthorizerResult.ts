export type Error = {
    type: string;
    message: string;
}

export type PasswordAuthorizerResult = {
    succeeded: boolean;
    errors: Error[];
}