/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    deleteCompleteSoloStreakTaskMiddlewares,
    completeSoloStreakTaskParamsValidationMiddleware,
    deleteCompleteSoloStreakTaskMiddleware,
    getDeleteCompleteSoloStreakTaskMiddleware,
    sendCompleteSoloStreakTaskDeletedResponseMiddleware,
    getSendCompleteSoloStreakTaskDeletedResponseMiddleware,
} from './deleteCompleteSoloStreakTaskMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

describe('completeSoloStreakTaskParamsValidationMiddleware', () => {
    test('sends completeSoloStreakTaskId is not defined error', () => {
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

        completeSoloStreakTaskParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "completeSoloStreakTaskId" fails because ["completeSoloStreakTaskId" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends completeSoloStreakTaskId is not a string error', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: { completeSoloStreakTaskId: 123 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        completeSoloStreakTaskParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "completeSoloStreakTaskId" fails because ["completeSoloStreakTaskId" must be a string]',
        });
        expect(next).not.toBeCalled();
    });
});

describe('deleteCompleteSoloStreakTaskMiddleware', () => {
    test('sets response.locals.deletedCompleteSoloStreakTask', async () => {
        expect.assertions(3);
        const completeSoloStreakTaskId = 'abc123';
        const findByIdAndDelete = jest.fn(() => Promise.resolve(true));
        const completeSoloStreakTaskModel = {
            findByIdAndDelete,
        };
        const request: any = { params: { completeSoloStreakTaskId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getDeleteCompleteSoloStreakTaskMiddleware(completeSoloStreakTaskModel as any);

        await middleware(request, response, next);

        expect(findByIdAndDelete).toBeCalledWith(completeSoloStreakTaskId);
        expect(response.locals.deletedCompleteSoloStreakTask).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('throws NoCompleteSoloStreakTaskToDeleteFound error when no solo streak is found', async () => {
        expect.assertions(1);
        const completeSoloStreakTaskId = 'abc123';
        const findByIdAndDelete = jest.fn(() => Promise.resolve(false));
        const completeSoloStreakTaskModel = {
            findByIdAndDelete,
        };
        const request: any = { params: { completeSoloStreakTaskId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getDeleteCompleteSoloStreakTaskMiddleware(completeSoloStreakTaskModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.NoCompleteSoloStreakTaskToDeleteFound));
    });

    test('calls next with DeleteCompleteSoloStreakTaskMiddleware error on failure', async () => {
        expect.assertions(1);
        const completeSoloStreakTaskId = 'abc123';
        const error = 'error';
        const findByIdAndDelete = jest.fn(() => Promise.reject(error));
        const completeSoloStreakTaskModel = {
            findByIdAndDelete,
        };
        const request: any = { params: { completeSoloStreakTaskId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getDeleteCompleteSoloStreakTaskMiddleware(completeSoloStreakTaskModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.DeleteCompleteSoloStreakTaskMiddleware, expect.any(Error)),
        );
    });
});

describe('sendCompleteSoloStreakTaskDeletedResponseMiddleware', () => {
    test('responds with successful deletion', () => {
        expect.assertions(2);
        const successfulDeletionResponseCode = 204;
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {};
        const response: any = { status };
        const next = jest.fn();
        const middleware = getSendCompleteSoloStreakTaskDeletedResponseMiddleware(successfulDeletionResponseCode);

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
        const middleware = getSendCompleteSoloStreakTaskDeletedResponseMiddleware(successfulDeletionResponseCode);

        middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.SendCompleteSoloStreakTaskDeletedResponseMiddleware, expect.any(Error)),
        );
    });
});

describe('deleteCompleteSoloStreakTaskMiddlewares', () => {
    test('that deleteCompleteSoloStreakTaskMiddlewares are defined in the correct order', () => {
        expect.assertions(4);

        expect(deleteCompleteSoloStreakTaskMiddlewares.length).toEqual(3);
        expect(deleteCompleteSoloStreakTaskMiddlewares[0]).toEqual(completeSoloStreakTaskParamsValidationMiddleware);
        expect(deleteCompleteSoloStreakTaskMiddlewares[1]).toEqual(deleteCompleteSoloStreakTaskMiddleware);
        expect(deleteCompleteSoloStreakTaskMiddlewares[2]).toEqual(sendCompleteSoloStreakTaskDeletedResponseMiddleware);
    });
});
