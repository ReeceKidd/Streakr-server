/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    authenticationMiddlewares,
    ensureAudienceMatchesCognitoUserPool,
    getRetrieveUserMiddleware,
    retrieveUserMiddleware,
    decodeJWTMiddleware,
    getDecodeJWTMiddleware,
} from './authenticationMiddlewares';

import { CustomError } from '../../src/customError';
import { ErrorType } from '../../src/customError';
import { getServiceConfig } from '../../src/getServiceConfig';

const { COGNITO_APP_CLIENT_ID } = getServiceConfig();

describe(`decodeJWTMiddleware`, () => {
    test('if authorization header token is present it gets decoded and next is called.', () => {
        expect.assertions(3);
        const token =
            'eyJraWQiOiJkc3lrWWlWd25lakFtKzVac1wvY0JWQ3F0b3BzRng5WEpta1hkcUp4TXhyTT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJjYzdiZDAzOS01NjMxLTRhZmUtODJkOC00ODAzMzUzOTE3YmQiLCJhdWQiOiI2OGFncDhiY205YmlkaGg0cDk3cmoxa2UxZyIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJldmVudF9pZCI6IjAwYTk4NjRjLTAyYTMtNDUwZS04ZDBkLTcwNGVmNzEzYTJmYyIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNTcwOTcxMzkwLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtd2VzdC0xLmFtYXpvbmF3cy5jb21cL2V1LXdlc3QtMV9qek5HMnNrZTkiLCJjb2duaXRvOnVzZXJuYW1lIjoicmVlY2UiLCJleHAiOjE1NzEwNDY3NDAsImlhdCI6MTU3MTA0MzE0MCwiZW1haWwiOiJyZWVjZWtpZGQ5NUBnbWFpbC5jb20ifQ.Qq5FO7d7BFlODp6uWBpHJ96ovgrtsV5fg_jYYucB2s7DTV8ncrPujINJLCfrqzil67NVv9PatWoPUQZzRlSJBBWcYzqjN3C0z0aS4S5wa5AE_nbNf5nrywo9OnbjSFJxHB3B8XapHBbQ_nutuU9d4Tff0523e8aF27u5Qjk9yHaBoIK4YedmJU_qVTDgKipueZiZhPFP-hppBtd84ddcrTYF71goDhagBQQMTLTrOn46hkRrQBrWOmoKhQmjVlpJ3xafVo44O9t1HllaMH2jHIKcG6-QBwyVLh_v23rPRmqk8Q2fEBB-oX6fQh8v19Obvn3DbmgFYAD1zds8vX1z0w';
        const header = jest.fn(() => token);
        const jwtDecode = jest.fn(() => true);
        const request: any = {
            header,
        };
        const response: any = { locals: {} };
        const next = jest.fn();

        const middleware = getDecodeJWTMiddleware(jwtDecode as any);
        middleware(request, response, next);

        expect(jwtDecode).toBeCalledWith(token);
        expect(response.locals.decodedJwt).toBeDefined();
        expect(next).toBeCalled();
    });

    test('calls next with token is missing error', () => {
        expect.assertions(1);
        const header = jest.fn(() => undefined);
        const request: any = {
            header,
        };
        const response: any = {};
        const next = jest.fn();

        decodeJWTMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.TokenDoesNotExist));
    });

    test('calls next with DecodeJWTMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = { locals: {} };
        const next = jest.fn();

        decodeJWTMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.DecodeJWTMiddleware, expect.any(Error)));
    });
});

describe(`ensureAudienceMatchesCognitoUserPool`, () => {
    afterAll(() => {
        jest.resetAllMocks();
    });
    test('if decodedJWT audience matches cognito app client ID call next.', () => {
        expect.assertions(1);
        const decodedJwt = {
            aud: COGNITO_APP_CLIENT_ID,
        };
        const request: any = {};
        const response: any = { locals: { decodedJwt } };
        const next = jest.fn();

        ensureAudienceMatchesCognitoUserPool(request, response, next);

        expect(next).toBeCalledWith();
    });

    test('if decodedJWT audience does not equal Cognito App Client ID throw AudienceDoesNotMatchCognitoAppClientId', () => {
        expect.assertions(1);
        const decodedJwt = {
            aud: 'invalid',
        };
        const request: any = {};
        const response: any = { locals: { decodedJwt } };
        const next = jest.fn();

        ensureAudienceMatchesCognitoUserPool(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.AudienceDoesNotMatchCognitoAppClientId));
    });

    test('calls next with EnsureAudienceMatchesCognitoUserPool error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = { locals: {} };
        const next = jest.fn();

        ensureAudienceMatchesCognitoUserPool(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.EnsureAudienceMatchesCognitoUserPool, expect.any(Error)));
    });
});

describe('retrieveUserMiddleware', () => {
    test('sets response.locals.user and calls next()', async () => {
        expect.assertions(4);
        const username = 'username';
        const decodedJwt = {
            'cognito:username': username,
        };
        const lean = jest.fn(() => true);
        const findOne = jest.fn(() => ({ lean }));
        const userModel = { findOne };
        const request: any = {};
        const response: any = { locals: { decodedJwt } };
        const next = jest.fn();
        const middleware = getRetrieveUserMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(response.locals.user).toBeDefined();
        expect(findOne).toBeCalledWith({ username });
        expect(lean).toBeCalledWith();
        expect(next).toBeCalledWith();
    });

    test('throws AuthInvalidTokenNoCognitoUsername when username does not exist on decoded token', async () => {
        expect.assertions(1);
        const decodedJwt = {};
        const lean = jest.fn(() => false);
        const findOne = jest.fn(() => ({ lean }));
        const userModel = { findOne };
        const request: any = {};
        const response: any = { locals: { decodedJwt } };
        const next = jest.fn();
        const middleware = getRetrieveUserMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.AuthInvalidTokenNoCognitoUsername));
    });

    test('throws AuthUserDoesNotExist when user does not exist', async () => {
        expect.assertions(1);
        const username = 'username';
        const decodedJwt = {
            'cognito:username': username,
        };
        const lean = jest.fn(() => false);
        const findOne = jest.fn(() => ({ lean }));
        const userModel = { findOne };
        const request: any = {};
        const response: any = { locals: { decodedJwt } };
        const next = jest.fn();
        const middleware = getRetrieveUserMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.AuthUserDoesNotExist));
    });

    test('throws RetrieveUserMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const userId = 'abcd';
        const findOne = jest.fn(() => ({}));
        const userModel = { findOne };
        const request: any = { body: { userId } };
        const response: any = { status, locals: {} };
        const next = jest.fn();
        const middleware = getRetrieveUserMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.RetrieveUserMiddleware, expect.any(Error)));
    });
});

describe(`authenticationMiddlewares`, () => {
    test('are defined in the correct order', async () => {
        expect.assertions(4);

        expect(authenticationMiddlewares.length).toEqual(3);
        expect(authenticationMiddlewares[0]).toBe(decodeJWTMiddleware);
        expect(authenticationMiddlewares[1]).toBe(ensureAudienceMatchesCognitoUserPool);
        expect(authenticationMiddlewares[2]).toBe(retrieveUserMiddleware);
    });
});
