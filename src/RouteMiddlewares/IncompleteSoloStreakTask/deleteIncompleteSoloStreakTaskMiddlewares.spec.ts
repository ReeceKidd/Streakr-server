/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    deleteIncompleteSoloStreakTaskMiddlewares,
    incompleteSoloStreakTaskParamsValidationMiddleware,
    deleteIncompleteSoloStreakTaskMiddleware,
    getDeleteIncompleteSoloStreakTaskMiddleware,
    sendIncompleteSoloStreakTaskDeletedResponseMiddleware,
    getSendIncompleteSoloStreakTaskDeletedResponseMiddleware,
} from './deleteIncompleteSoloStreakTaskMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

describe('incompleteSoloStreakTaskParamsValidationMiddleware', () => {
    test('sends incompleteSoloStreakTaskId is not defined error', () => {
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

        incompleteSoloStreakTaskParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "incompleteSoloStreakTaskId" fails because ["incompleteSoloStreakTaskId" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends incompleteSoloStreakTaskId is not a string error', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: { incompleteSoloStreakTaskId: 123 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        incompleteSoloStreakTaskParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "incompleteSoloStreakTaskId" fails because ["incompleteSoloStreakTaskId" must be a string]',
        });
        expect(next).not.toBeCalled();
    });
});

describe('deleteIncompleteSoloStreakTaskMiddleware', () => {
    test('sets response.locals.deletedIncompleteSoloStreakTask', async () => {
        expect.assertions(3);
        const incompleteSoloStreakTaskId = 'abc123';
        const findByIdAndDelete = jest.fn(() => Promise.resolve(true));
        const incompleteSoloStreakTaskModel = {
            findByIdAndDelete,
        };
        const request: any = { params: { incompleteSoloStreakTaskId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getDeleteIncompleteSoloStreakTaskMiddleware(incompleteSoloStreakTaskModel as any);

        await middleware(request, response, next);

        expect(findByIdAndDelete).toBeCalledWith(incompleteSoloStreakTaskId);
        expect(response.locals.deletedIncompleteSoloStreakTask).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('throws NoIncompleteSoloStreakTaskToDeleteFound error when no solo streak is found', async () => {
        expect.assertions(1);
        const incompleteSoloStreakTaskId = 'abc123';
        const findByIdAndDelete = jest.fn(() => Promise.resolve(false));
        const incompleteSoloStreakTaskModel = {
            findByIdAndDelete,
        };
        const request: any = { params: { incompleteSoloStreakTaskId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getDeleteIncompleteSoloStreakTaskMiddleware(incompleteSoloStreakTaskModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.NoIncompleteSoloStreakTaskToDeleteFound));
    });

    test('calls next with DeleteIncompleteSoloStreakTaskMiddleware error on failure', async () => {
        expect.assertions(1);
        const incompleteSoloStreakTaskId = 'abc123';
        const error = 'error';
        const findByIdAndDelete = jest.fn(() => Promise.reject(error));
        const incompleteSoloStreakTaskModel = {
            findByIdAndDelete,
        };
        const request: any = { params: { incompleteSoloStreakTaskId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getDeleteIncompleteSoloStreakTaskMiddleware(incompleteSoloStreakTaskModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.DeleteIncompleteSoloStreakTaskMiddleware, expect.any(Error)),
        );
    });
});

describe('sendIncompleteSoloStreakTaskDeletedResponseMiddleware', () => {
    test('responds with successful deletion', () => {
        expect.assertions(2);
        const successfulDeletionResponseCode = 204;
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {};
        const response: any = { status };
        const next = jest.fn();
        const middleware = getSendIncompleteSoloStreakTaskDeletedResponseMiddleware(successfulDeletionResponseCode);

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
        const middleware = getSendIncompleteSoloStreakTaskDeletedResponseMiddleware(successfulDeletionResponseCode);

        middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.SendIncompleteSoloStreakTaskDeletedResponseMiddleware, expect.any(Error)),
        );
    });
});

describe('deleteIncompleteSoloStreakTaskMiddlewares', () => {
    test('that deleteIncompleteSoloStreakTaskMiddlewares are defined in the correct order', () => {
        expect.assertions(4);

        expect(deleteIncompleteSoloStreakTaskMiddlewares.length).toEqual(3);
        expect(deleteIncompleteSoloStreakTaskMiddlewares[0]).toEqual(
            incompleteSoloStreakTaskParamsValidationMiddleware,
        );
        expect(deleteIncompleteSoloStreakTaskMiddlewares[1]).toEqual(deleteIncompleteSoloStreakTaskMiddleware);
        expect(deleteIncompleteSoloStreakTaskMiddlewares[2]).toEqual(
            sendIncompleteSoloStreakTaskDeletedResponseMiddleware,
        );
    });
});
