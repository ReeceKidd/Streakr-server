import { Request, Response, NextFunction } from 'express';
import { ErrorStatusCodes } from '../../Server/statusCodes';
import { FailureMessageKeys } from '../../Messages/failureMessages';
import { AuthResponseObject } from 'Server/response';
import { getLocalisedString } from '../../Messages/getLocalisedString';
import { MessageCategories } from '../../Messages/messageCategories';
import { VerifyJsonWebTokenResponseLocals } from 'Utils/verifyUsersJsonWebToken';


export const getJsonWebTokenErrorResponseMiddleware = (unauthorizedErrorMessage: string) => (request: Request, response: Response, next: NextFunction) => {
    try {
        const { jsonWebTokenError } = response.locals as VerifyJsonWebTokenResponseLocals;
        if (jsonWebTokenError) {
            const jsonWebTokenErrorResponse: AuthResponseObject = { message: unauthorizedErrorMessage, auth: false }
            return response
                .status(ErrorStatusCodes.lacksAuthenticationCredientails)
                .send(jsonWebTokenErrorResponse)
        }
        next()
    } catch (err) {
        next(err);
    }
};

const localisedUnauthorizedErrorMessage = getLocalisedString(MessageCategories.failureMessages, FailureMessageKeys.unauthorisedMessage)
export const jsonWebTokenErrorResponseMiddleware = getJsonWebTokenErrorResponseMiddleware(localisedUnauthorizedErrorMessage)

