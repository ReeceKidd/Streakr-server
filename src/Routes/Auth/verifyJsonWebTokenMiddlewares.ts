import { retreiveJsonWebTokenMiddleware } from "../../Middleware/Auth/retreiveJsonWebTokenMiddleware";
import { jsonWebTokenValidationMiddleware } from "../../Middleware/Validation/Auth/jsonWebTokenValidation";
import { decodeJsonWebTokenMiddleware } from "../../Middleware/Auth/decodeJsonWebTokenMiddleware";
import { jsonWebTokenVerificationSuccessfulMiddleware } from "../../Middleware/Auth/jsonWebTokenVerificationSuccessfulMiddleware";
import { jsonWebTokenErrorResponseMiddleware } from "../../Middleware/ErrorHandler/jsonWebTokenErrorResponseMiddleware";

export const verifyJsonWebTokenMiddlewares = [
    retreiveJsonWebTokenMiddleware,
    jsonWebTokenValidationMiddleware,
    decodeJsonWebTokenMiddleware,
    jsonWebTokenErrorResponseMiddleware,
    jsonWebTokenVerificationSuccessfulMiddleware
]