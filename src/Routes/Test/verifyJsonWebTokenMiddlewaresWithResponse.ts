
import { jsonWebTokenVerificationSuccessfulMiddleware } from "../../Middleware/Handlers/jsonWebTokenVerificationSuccessfulMiddleware";
import { verifyJsonWebTokenMiddlewares } from "../../Utils/verifyUsersJsonWebTokenMiddlewares";

export const verifyJsonWebTokenMiddlewaresWithResponse = [
    verifyJsonWebTokenMiddlewares,
    jsonWebTokenVerificationSuccessfulMiddleware
]