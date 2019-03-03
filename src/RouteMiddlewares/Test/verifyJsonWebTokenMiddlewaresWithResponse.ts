
import { jsonWebTokenVerificationSuccessfulMiddleware } from "../../Middleware/Handlers/jsonWebTokenVerificationSuccessfulMiddleware";
import { verifyJsonWebTokenMiddlewares } from "../Utils/verifyJsonWebTokenMiddlewares";

export const verifyJsonWebTokenMiddlewaresWithResponse = [
    verifyJsonWebTokenMiddlewares,
    jsonWebTokenVerificationSuccessfulMiddleware
]