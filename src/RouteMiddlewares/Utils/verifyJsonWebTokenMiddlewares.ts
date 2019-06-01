
import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

import { jwtSecret } from "../../../secret/jwt-secret";
import { SupportedRequestHeaders } from "../../Server/headers";
import { getLocalisedString } from "../../Messages/getLocalisedString";
import { MessageCategories } from "../../Messages/messageCategories";
import { FailureMessageKeys } from "../../Messages/failureMessages";
import { IMinimumUserData } from "../../Models/User";
import { ResponseCodes } from "../../Server/responseCodes";

export interface VerifyJsonWebTokenResponseLocals {
    jsonWebToken?: string;
    decodedJsonWebToken?: DecodedJsonWebToken;
    jsonWebTokenError?: object;
}


export const getRetreiveJsonWebTokenMiddleware = (jsonWebTokenHeader: string) => (
    request: Request, response: Response, next: NextFunction) => {
    try {
        const requestJsonWebTokenHeader = request.headers[jsonWebTokenHeader];
        response.locals.jsonWebToken = requestJsonWebTokenHeader;
        next();
    } catch (err) {
        next(err);
    }
};

export const retreiveJsonWebTokenMiddleware = getRetreiveJsonWebTokenMiddleware(SupportedRequestHeaders.xAccessToken);


export const getJsonWebTokenDoesNotExistResponseMiddleware = (jsonWebTokenValidationErrorObject: { auth: boolean, message: string }, unauthorizedStatusCode: number) => (request: Request, response: Response, next: NextFunction) => {
    try {
        const { jsonWebToken } = response.locals as VerifyJsonWebTokenResponseLocals;
        if (!jsonWebToken) return response.status(unauthorizedStatusCode).send(jsonWebTokenValidationErrorObject);
        next();
    } catch (err) {
        next(err);
    }
};

const localisedMissingJsonWebTokenMessage = getLocalisedString(MessageCategories.failureMessages, FailureMessageKeys.missingJsonWebTokenMessage);

export const jsonWebTokenDoesNotExistResponseMiddleware = getJsonWebTokenDoesNotExistResponseMiddleware({ auth: false, message: localisedMissingJsonWebTokenMessage }, ResponseCodes.unautohorized);

export interface DecodedJsonWebToken {
    minimumUserData: IMinimumUserData;
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
            (response.locals as VerifyJsonWebTokenResponseLocals).jsonWebTokenError = err;
            next();
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
            const jsonWebTokenErrorResponse = { message: unauthorizedErrorMessage, auth: false };
            return response
                .status(unauthorizedStatusCode)
                .send(jsonWebTokenErrorResponse);
        }
        next();
    } catch (err) {
        next(err);
    }
};

const localisedUnauthorizedErrorMessage = getLocalisedString(MessageCategories.failureMessages, FailureMessageKeys.unauthorisedMessage);
export const jsonWebTokenErrorResponseMiddleware = getJsonWebTokenErrorResponseMiddleware(localisedUnauthorizedErrorMessage, ResponseCodes.unautohorized);

export const setMinimumUserDataOnResponseLocals = (request: Request, response: Response, next: NextFunction) => {
    try {
        response.locals.minimumUserData = (response.locals as VerifyJsonWebTokenResponseLocals).decodedJsonWebToken.minimumUserData;
        next();
    } catch (err) {
        next(err);
    }
};

export const verifyJsonWebTokenMiddlewares = [
    retreiveJsonWebTokenMiddleware,
    jsonWebTokenDoesNotExistResponseMiddleware,
    decodeJsonWebTokenMiddleware,
    jsonWebTokenErrorResponseMiddleware,
    setMinimumUserDataOnResponseLocals
];


