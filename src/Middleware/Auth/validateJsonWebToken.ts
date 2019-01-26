import { jsonWebTokenValidationMiddleware } from "../Validation/Auth/jsonWebTokenValidation";
import { decodeJsonWebTokenMiddleware } from "./decodeJsonWebTokenMiddleware";

export const validateJsonWebTokenMiddleware = () => {
    return [
        jsonWebTokenValidationMiddleware,
        decodeJsonWebTokenMiddleware
    ]
}