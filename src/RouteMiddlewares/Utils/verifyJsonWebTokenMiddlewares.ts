
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { jwtSecret } from '../../../secret/jwt-secret';

import { SupportedHeaders } from '../../Server/headers';
import { getLocalisedString } from '../../Messages/getLocalisedString';
import { MessageCategories } from '../../Messages/messageCategories';
import { FailureMessageKeys } from '../../Messages/failureMessages';
import { ErrorStatusCodes } from '../../Server/statusCodes';
import { AuthResponseObject } from 'Server/response';

import { IMinimumUserData } from '../../Models/User';

export interface VerifyJsonWebTokenResponseLocals {
    jsonWebToken?: string;
    decodedJsonWebToken?: DecodedJsonWebToken
    jsonWebTokenError?: object
}


export const getRetreiveJsonWebTokenMiddleware = (jsonWebTokenHeader: string) => (
    request: Request, response: Response, next: NextFunction) => {
    try {
        (response.locals as VerifyJsonWebTokenResponseLocals).jsonWebToken = request.headers[jsonWebTokenHeader].toString()
        next();
    } catch (err) {
        next(err);
    }
};

export const retreiveJsonWebTokenMiddleware = getRetreiveJsonWebTokenMiddleware(SupportedHeaders.xAccessToken);


export const getJsonWebTokenDoesNotExistResponseMiddleware = (jsonWebTokenValidationErrorObject: { auth: boolean, message: string }) => (request: Request, response: Response, next: NextFunction) => {
    try {
        const { jsonWebToken } = response.locals as VerifyJsonWebTokenResponseLocals;
        if (!jsonWebToken) return response.status(401).send(jsonWebTokenValidationErrorObject);
        next();
    } catch (err) {
        next(err);
    }
};

const localisedMissingJsonWebTokenMessage = getLocalisedString(MessageCategories.failureMessages, FailureMessageKeys.missingJsonWebTokenMessage)

export const jsonWebTokenDoesNotExistResponseMiddleware = getJsonWebTokenDoesNotExistResponseMiddleware({ auth: false, message: localisedMissingJsonWebTokenMessage });







export interface DecodedJsonWebToken {
    minimumUserData: IMinimumUserData
}

export const getDecodeJsonWebTokenMiddleware = (
    verify: Function,
    jsonWebTokenSecret: string,
) => (request: Request, response: Response, next: NextFunction) => {
    try {
        const { jsonWebToken } = response.locals as VerifyJsonWebTokenResponseLocals;
        try {
            (response.locals as VerifyJsonWebTokenResponseLocals).decodedJsonWebToken = verify(
                jsonWebToken,
                jsonWebTokenSecret,
            );
            next();
        } catch (err) {
            (response.locals as VerifyJsonWebTokenResponseLocals).jsonWebTokenError = err
            next()
        }
    } catch (err) {
        next(err);
    }
};

export const decodeJsonWebTokenMiddleware = getDecodeJsonWebTokenMiddleware(jwt.verify, jwtSecret);

export const getJsonWebTokenErrorResponseMiddleware = (unauthorizedErrorMessage: string, unauthorizedStatusCode: number) => (request: Request, response: Response, next: NextFunction) => {
    try {
        const { jsonWebTokenError } = response.locals as VerifyJsonWebTokenResponseLocals;
        if (jsonWebTokenError) {
            const jsonWebTokenErrorResponse: AuthResponseObject = { message: unauthorizedErrorMessage, auth: false }
            return response
                .status(unauthorizedStatusCode)
                .send(jsonWebTokenErrorResponse)
        }
        next()
    } catch (err) {
        next(err);
    }
};

const localisedUnauthorizedErrorMessage = getLocalisedString(MessageCategories.failureMessages, FailureMessageKeys.unauthorisedMessage)
export const jsonWebTokenErrorResponseMiddleware = getJsonWebTokenErrorResponseMiddleware(localisedUnauthorizedErrorMessage, ErrorStatusCodes.lacksAuthenticationCredientails)

export const verifyJsonWebTokenMiddlewares = [
    retreiveJsonWebTokenMiddleware,
    jsonWebTokenDoesNotExistResponseMiddleware,
    decodeJsonWebTokenMiddleware,
    jsonWebTokenErrorResponseMiddleware,
]


