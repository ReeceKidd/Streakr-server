export type StatusCode = ErrorStatusCodes | SuccessStatusCode

export enum ErrorStatusCodes {
    lacksAuthenticationCredientails = 401,
    userValidationError = 400
}

export enum SuccessStatusCode {

}