
import { Request, Response, NextFunction } from 'express';
import { verifyJsonWebTokenMiddlewares } from "./verifyJsonWebTokenMiddlewares";

import { SuccessMessageKeys } from 'Messages/successMessages';
import { getLocalisedString } from 'Messages/getLocalisedString';
import { MessageCategories } from 'Messages/messageCategories';
import { AuthResponseObject } from 'Server/response';
import { DecodedJsonWebToken } from './verifyJsonWebTokenMiddlewares';
import { VerifyJsonWebTokenResponseLocals } from './verifyJsonWebTokenMiddlewares';

export interface SuccessfulJsonWebTokenVerificationResponse extends AuthResponseObject {
    decodedJsonWebToken: DecodedJsonWebToken
}

export const getJsonWebTokenVerificationSuccessfulMiddleware = (jsonWebTokenVerificationSuccessfulMessage: string) => (
    request: Request,
    response: Response,
    next: NextFunction,
) => {
    try {
        const { decodedJsonWebToken } = response.locals as VerifyJsonWebTokenResponseLocals
        const jsonWebTokenVerificationSuccessfulResponse: SuccessfulJsonWebTokenVerificationResponse = { decodedJsonWebToken, message: jsonWebTokenVerificationSuccessfulMessage, auth: true }
        return response.send(jsonWebTokenVerificationSuccessfulResponse);
    } catch (err) {
        next(err);
    }
};

const localisedJsonWebTokenVerificationSuccessMessage = getLocalisedString(MessageCategories.successMessages, SuccessMessageKeys.jsonWebTokenVerificationSuccessfulMessage)

export const jsonWebTokenVerificationSuccessfulMiddleware = getJsonWebTokenVerificationSuccessfulMiddleware(localisedJsonWebTokenVerificationSuccessMessage);


export const verifyJsonWebTokenMiddlewaresWithResponse = [
    verifyJsonWebTokenMiddlewares,
    jsonWebTokenVerificationSuccessfulMiddleware
]