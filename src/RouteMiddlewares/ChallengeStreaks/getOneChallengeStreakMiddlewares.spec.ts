/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    getOneChallengeStreakMiddlewares,
    retrieveChallengeStreakMiddleware,
    getRetrieveChallengeStreakMiddleware,
    sendChallengeStreakMiddleware,
    getChallengeStreakParamsValidationMiddleware,
    getSendChallengeStreakMiddleware,
} from './getOneChallengeStreakMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { ErrorType, CustomError } from '../../customError';

describe(`getChallengeStreakParamsValidationMiddleware`, () => {
    const challengeStreakId = '12345678';

    test('calls next() when correct params are supplied', () => {
        expect.assertions(1);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: { challengeStreakId },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        getChallengeStreakParamsValidationMiddleware(request, response, next);

        expect(next).toBeCalled();
    });

    test('sends error response when challengeStreakId is missing', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: {},
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        getChallengeStreakParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "challengeStreakId" fails because ["challengeStreakId" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends error response when challengeStreakId is not a string', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: { challengeStreakId: 1234 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        getChallengeStreakParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "challengeStreakId" fails because ["challengeStreakId" must be a string]',
        });
        expect(next).not.toBeCalled();
    });
});

describe('retrieveChallengeStreakMiddleware', () => {
    test('sets response.locals.challengeStreak', async () => {
        expect.assertions(3);
        const lean = jest.fn(() => Promise.resolve(true));
        const findOne = jest.fn(() => ({ lean }));
        const challengeStreakModel = {
            findOne,
        };
        const challengeStreakId = 'abcd';
        const request: any = { params: { challengeStreakId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetrieveChallengeStreakMiddleware(challengeStreakModel as any);

        await middleware(request, response, next);

        expect(findOne).toBeCalledWith({ _id: challengeStreakId });
        expect(response.locals.challengeStreak).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('throws GetChallengeStreakNoChallengeStreakFound when challenge streak is not found', async () => {
        expect.assertions(1);
        const lean = jest.fn(() => Promise.resolve(false));
        const findOne = jest.fn(() => ({ lean }));
        const challengeStreakModel = {
            findOne,
        };
        const challengeStreakId = 'abcd';
        const request: any = { params: { challengeStreakId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetrieveChallengeStreakMiddleware(challengeStreakModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.GetChallengeStreakNoChallengeStreakFound));
    });

    test('calls next with RetrieveChallengeStreakMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const errorMessage = 'error';
        const lean = jest.fn(() => Promise.reject(errorMessage));
        const findOne = jest.fn(() => ({ lean }));
        const challengeStreakModel = {
            findOne,
        };
        const challengeStreakId = 'abcd';
        const request: any = { params: { challengeStreakId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetrieveChallengeStreakMiddleware(challengeStreakModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.RetrieveChallengeStreakMiddleware, expect.any(Error)));
    });
});

describe('sendChallengeStreakMiddleware', () => {
    test('sends challengeStreak', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const challengeStreak = { _id: 'abc' };
        const request: any = {};
        const response: any = { locals: { challengeStreak }, status };
        const next = jest.fn();
        const resourceCreatedCode = 401;
        const middleware = getSendChallengeStreakMiddleware(resourceCreatedCode);

        middleware(request, response, next);

        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(resourceCreatedCode);
        expect(send).toBeCalledWith(challengeStreak);
    });

    test('calls next with SendChallengeStreakMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const error = 'error';
        const send = jest.fn(() => Promise.reject(error));
        const status = jest.fn(() => ({ send }));
        const response: any = { status };
        const next = jest.fn();
        const resourceCreatedResponseCode = 401;
        const middleware = getSendChallengeStreakMiddleware(resourceCreatedResponseCode);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendChallengeStreakMiddleware, expect.any(Error)));
    });
});

describe('getOneChallengeStreakMiddlewares', () => {
    test('that getChallengeStreakMiddlewares are defined in the correct order', () => {
        expect.assertions(4);

        expect(getOneChallengeStreakMiddlewares.length).toEqual(3);
        expect(getOneChallengeStreakMiddlewares[0]).toEqual(getChallengeStreakParamsValidationMiddleware);
        expect(getOneChallengeStreakMiddlewares[1]).toEqual(retrieveChallengeStreakMiddleware);
        expect(getOneChallengeStreakMiddlewares[2]).toEqual(sendChallengeStreakMiddleware);
    });
});
