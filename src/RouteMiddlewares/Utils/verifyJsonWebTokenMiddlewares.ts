
import { retreiveJsonWebTokenMiddleware } from "../../Middleware/Auth/retreiveJsonWebTokenMiddleware";
import { decodeJsonWebTokenMiddleware, DecodedJsonWebToken } from "../../Middleware/Auth/decodeJsonWebTokenMiddleware";
import { jsonWebTokenErrorResponseMiddleware } from "../../Middleware/ErrorHandler/jsonWebTokenErrorResponseMiddleware";
import { jsonWebTokenDoesNotExistResponseMiddleware } from "../../Middleware/Validation/Auth/jsonWebTokenDoesNotExistResponseMiddleware";

export interface VerifyJsonWebTokenResponseLocals {
    jsonWebToken?: string;
    decodedJsonWebToken?: DecodedJsonWebToken
    jsonWebTokenError?: object
}

export const verifyJsonWebTokenMiddlewares = [
    retreiveJsonWebTokenMiddleware,
    jsonWebTokenDoesNotExistResponseMiddleware,
    decodeJsonWebTokenMiddleware,
    jsonWebTokenErrorResponseMiddleware,
]


