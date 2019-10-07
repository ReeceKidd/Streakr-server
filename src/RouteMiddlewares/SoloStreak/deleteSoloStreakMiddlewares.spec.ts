/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    deleteSoloStreakMiddlewares,
    soloStreakParamsValidationMiddleware,
    deleteSoloStreakMiddleware,
    getDeleteSoloStreakMiddleware,
    sendSoloStreakDeletedResponseMiddleware,
    getSendSoloStreakDeletedResponseMiddleware,
} from './deleteSoloStreakMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

describe('soloStreakParamsValidationMiddleware', () => {
    test('sends soloStreakId is not defined error', () => {
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

        soloStreakParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "soloStreakId" fails because ["soloStreakId" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends soloStreakId is not a string error', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: { soloStreakId: 123 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        soloStreakParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "soloStreakId" fails because ["soloStreakId" must be a string]',
        });
        expect(next).not.toBeCalled();
    });
});

describe('deleteSoloStreakMiddleware', () => {
    test('sets response.locals.deletedSoloStreak', async () => {
        expect.assertions(3);
        const soloStreakId = 'abc123';
        const findByIdAndDelete = jest.fn(() => Promise.resolve(true));
        const soloStreakModel = {
            findByIdAndDelete,
        };
        const request: any = { params: { soloStreakId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getDeleteSoloStreakMiddleware(soloStreakModel as any);

        await middleware(request, response, next);

        expect(findByIdAndDelete).toBeCalledWith(soloStreakId);
        expect(response.locals.deletedSoloStreak).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('throws NoSoloStreakToDeleteFound error when no solo streak is found', async () => {
        expect.assertions(1);
        const soloStreakId = 'abc123';
        const findByIdAndDelete = jest.fn(() => Promise.resolve(false));
        const soloStreakModel = {
            findByIdAndDelete,
        };
        const request: any = { params: { soloStreakId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getDeleteSoloStreakMiddleware(soloStreakModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.NoSoloStreakToDeleteFound));
    });

    test('calls next with DeleteSoloStreakMiddleware error on failure', async () => {
        expect.assertions(1);
        const soloStreakId = 'abc123';
        const error = 'error';
        const findByIdAndDelete = jest.fn(() => Promise.reject(error));
        const soloStreakModel = {
            findByIdAndDelete,
        };
        const request: any = { params: { soloStreakId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getDeleteSoloStreakMiddleware(soloStreakModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.DeleteSoloStreakMiddleware, expect.any(Error)));
    });
});

describe('sendSoloStreakDeletedResponseMiddleware', () => {
    test('responds with successful deletion', () => {
        expect.assertions(2);
        const successfulDeletionResponseCode = 204;
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {};
        const response: any = { status };
        const next = jest.fn();
        const middleware = getSendSoloStreakDeletedResponseMiddleware(successfulDeletionResponseCode);

        middleware(request, response, next);

        expect(status).toBeCalledWith(successfulDeletionResponseCode);
        expect(next).not.toBeCalled();
    });

    test('that on error next is called with error', () => {
        expect.assertions(1);
        const successfulDeletionResponseCode = 204;
        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        const middleware = getSendSoloStreakDeletedResponseMiddleware(successfulDeletionResponseCode);

        middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.SendSoloStreakDeletedResponseMiddleware, expect.any(Error)),
        );
    });
});

describe('deleteSoloStreakMiddlewares', () => {
    test('that deleteSoloStreakMiddlewares are defined in the correct order', () => {
        expect.assertions(4);

        expect(deleteSoloStreakMiddlewares.length).toEqual(3);
        expect(deleteSoloStreakMiddlewares[0]).toEqual(soloStreakParamsValidationMiddleware);
        expect(deleteSoloStreakMiddlewares[1]).toEqual(deleteSoloStreakMiddleware);
        expect(deleteSoloStreakMiddlewares[2]).toEqual(sendSoloStreakDeletedResponseMiddleware);
    });
});
