/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    getOneSoloStreakMiddlewares,
    retrieveSoloStreakMiddleware,
    getRetrieveSoloStreakMiddleware,
    sendSoloStreakMiddleware,
    getSoloStreakParamsValidationMiddleware,
} from './getOneSoloStreakMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { ErrorType, CustomError } from '../../customError';

describe(`getSoloStreakParamsValidationMiddleware`, () => {
    const soloStreakId = '12345678';

    test('calls next() when correct params are supplied', () => {
        expect.assertions(1);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: { soloStreakId },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        getSoloStreakParamsValidationMiddleware(request, response, next);

        expect(next).toBeCalled();
    });

    test('sends error response when soloStreakId is missing', () => {
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

        getSoloStreakParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "soloStreakId" fails because ["soloStreakId" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends error response when soloStreakId is not a string', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: { soloStreakId: 1234 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        getSoloStreakParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "soloStreakId" fails because ["soloStreakId" must be a string]',
        });
        expect(next).not.toBeCalled();
    });
});

describe('retrieveSoloStreakMiddleware', () => {
    test('sets response.locals.soloStreak', async () => {
        expect.assertions(3);
        const lean = jest.fn(() => Promise.resolve(true));
        const findOne = jest.fn(() => ({ lean }));
        const soloStreakModel = {
            findOne,
        };
        const soloStreakId = 'abcd';
        const request: any = { params: { soloStreakId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetrieveSoloStreakMiddleware(soloStreakModel as any);

        await middleware(request, response, next);

        expect(findOne).toBeCalledWith({ _id: soloStreakId });
        expect(response.locals.soloStreak).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('throws GetSoloStreakNoSoloStreakFound when solo streak is not found', async () => {
        expect.assertions(1);
        const lean = jest.fn(() => Promise.resolve(false));
        const findOne = jest.fn(() => ({ lean }));
        const soloStreakModel = {
            findOne,
        };
        const soloStreakId = 'abcd';
        const request: any = { params: { soloStreakId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetrieveSoloStreakMiddleware(soloStreakModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.GetSoloStreakNoSoloStreakFound));
    });

    test('calls next with RetrieveSoloStreakMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const errorMessage = 'error';
        const lean = jest.fn(() => Promise.reject(errorMessage));
        const findOne = jest.fn(() => ({ lean }));
        const soloStreakModel = {
            findOne,
        };
        const soloStreakId = 'abcd';
        const request: any = { params: { soloStreakId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetrieveSoloStreakMiddleware(soloStreakModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.RetrieveSoloStreakMiddleware, expect.any(Error)));
    });
});

describe('sendSoloStreakMiddleware', () => {
    test('sends soloStreak', () => {
        expect.assertions(2);
        const send = jest.fn();
        const soloStreak = { _id: 'abc' };
        const request: any = {};
        const response: any = { locals: { soloStreak }, send };
        const next = jest.fn();

        sendSoloStreakMiddleware(request, response, next);

        expect(next).not.toBeCalled();
        expect(send).toBeCalledWith(soloStreak);
    });

    test('calls next with SendSoloStreakMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();

        await sendSoloStreakMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendSoloStreakMiddleware, expect.any(Error)));
    });
});

describe('getOneSoloStreakMiddlewares', () => {
    test('that getSoloStreakMiddlewares are defined in the correct order', () => {
        expect.assertions(4);

        expect(getOneSoloStreakMiddlewares.length).toEqual(3);
        expect(getOneSoloStreakMiddlewares[0]).toEqual(getSoloStreakParamsValidationMiddleware);
        expect(getOneSoloStreakMiddlewares[1]).toEqual(retrieveSoloStreakMiddleware);
        expect(getOneSoloStreakMiddlewares[2]).toEqual(sendSoloStreakMiddleware);
    });
});
