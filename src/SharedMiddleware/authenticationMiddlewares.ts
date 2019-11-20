import jwtDecode from 'jwt-decode';
import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';
import { CustomError, ErrorType } from '../customError';
import { UserModel, userModel } from '../Models/User';
import { getServiceConfig } from '../../src/getServiceConfig';
import { SupportedRequestHeaders } from '@streakoid/streakoid-sdk/lib';

const { COGNITO_APP_CLIENT_ID } = getServiceConfig();

export const getDecodeJWTMiddleware = (decode: typeof jwtDecode) => (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const token = request.header(SupportedRequestHeaders.Authorization);
        if (!token || token === 'null') {
            throw new CustomError(ErrorType.TokenDoesNotExist);
        }
        const decodedJwt = decode(token);
        response.locals.decodedJwt = decodedJwt;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.DecodeJWTMiddleware, err));
    }
};

export const decodeJWTMiddleware = getDecodeJWTMiddleware(jwtDecode);

export const ensureAudienceMatchesCognitoUserPool = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { decodedJwt } = response.locals;
        if (decodedJwt.aud !== COGNITO_APP_CLIENT_ID) {
            throw new CustomError(ErrorType.AudienceDoesNotMatchCognitoAppClientId);
        }
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.EnsureAudienceMatchesCognitoUserPool, err));
    }
};

export const getRetreiveUserMiddleware = (userModel: Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { decodedJwt } = response.locals;
        const username = decodedJwt['cognito:username'];
        if (!username) {
            throw new CustomError(ErrorType.AuthInvalidTokenNoCognitoUsername);
        }
        const user = await userModel.findOne({ username }).lean();
        if (!user) {
            throw new CustomError(ErrorType.AuthUserDoesNotExist);
        }
        response.locals.user = user;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.AuthRetreiveUserMiddleware, err));
    }
};

export const retreiveUserMiddleware = getRetreiveUserMiddleware(userModel);

export const authenticationMiddlewares = [
    decodeJWTMiddleware,
    ensureAudienceMatchesCognitoUserPool,
    retreiveUserMiddleware,
];
