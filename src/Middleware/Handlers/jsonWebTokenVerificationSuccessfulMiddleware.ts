import { Request, Response, NextFunction } from 'express';
import { SuccessMessageKeys } from '../../Messages/successMessages';
import { getLocalisedString } from '../../Messages/getLocalisedString';
import { MessageCategories } from '../../Messages/messageCategories';
import { AuthResponseObject } from 'Server/response';
import { DecodedJsonWebToken } from '../Auth/decodeJsonWebTokenMiddleware';
import { VerifyJsonWebTokenResponseLocals } from 'Utils/verifyUsersJsonWebTokenMiddlewares';

export interface SuccessfulJsonWebTokenVerificationResponse extends AuthResponseObject {
    decodedJsonWebToken: DecodedJsonWebToken
}

export const getJsonWebTokenVerificationSuccessfulMiddleware = (jsonWebTokenVerificationSuccessfulMessage: string) => (
    request: Request,
    response: Response,
    next: NextFunction,
) => {
    try {
        const { decodedJsonWebToken } = response.locals as VerifyJsonWebTokenResponseLocals;
        const jsonWebTokenVerificationSuccessfulResponse: SuccessfulJsonWebTokenVerificationResponse = { decodedJsonWebToken, message: jsonWebTokenVerificationSuccessfulMessage, auth: true }
        return response.send(jsonWebTokenVerificationSuccessfulResponse);
    } catch (err) {
        next(err);
    }
};

const localisedJsonWebTokenVerificationSuccessMessage = getLocalisedString(MessageCategories.successMessages, SuccessMessageKeys.jsonWebTokenVerificationSuccessfulMessage)

export const jsonWebTokenVerificationSuccessfulMiddleware = getJsonWebTokenVerificationSuccessfulMiddleware(localisedJsonWebTokenVerificationSuccessMessage);
