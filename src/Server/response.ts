export interface ResponseObject {
    message: string
}

export interface AuthResponseObject extends ResponseObject {
    auth: boolean
}