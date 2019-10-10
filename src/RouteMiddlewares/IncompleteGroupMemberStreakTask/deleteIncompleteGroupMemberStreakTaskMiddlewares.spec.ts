/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    deleteIncompleteGroupMemberStreakTaskMiddlewares,
    incompleteGroupMemberStreakTaskParamsValidationMiddleware,
    deleteIncompleteGroupMemberStreakTaskMiddleware,
    getDeleteIncompleteGroupMemberStreakTaskMiddleware,
    sendIncompleteGroupMemberStreakTaskDeletedResponseMiddleware,
    getSendIncompleteGroupMemberStreakTaskDeletedResponseMiddleware,
} from './deleteIncompleteGroupMemberStreakTaskMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

describe('incompleteGroupMemberStreakTaskParamsValidationMiddleware', () => {
    test('sends incompleteGroupMemberStreakTaskId is not defined error', () => {
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

        incompleteGroupMemberStreakTaskParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message:
                'child "incompleteGroupMemberStreakTaskId" fails because ["incompleteGroupMemberStreakTaskId" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends incompleteGroupMemberStreakTaskId is not a string error', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: { incompleteGroupMemberStreakTaskId: 123 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        incompleteGroupMemberStreakTaskParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message:
                'child "incompleteGroupMemberStreakTaskId" fails because ["incompleteGroupMemberStreakTaskId" must be a string]',
        });
        expect(next).not.toBeCalled();
    });
});

describe('deleteIncompleteGroupMemberStreakTaskMiddleware', () => {
    test('sets response.locals.deletedIncompleteGroupMemberStreakTask', async () => {
        expect.assertions(3);
        const incompleteGroupMemberStreakTaskId = 'abc123';
        const findByIdAndDelete = jest.fn(() => Promise.resolve(true));
        const incompleteGroupMemberStreakTaskModel = {
            findByIdAndDelete,
        };
        const request: any = { params: { incompleteGroupMemberStreakTaskId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getDeleteIncompleteGroupMemberStreakTaskMiddleware(
            incompleteGroupMemberStreakTaskModel as any,
        );

        await middleware(request, response, next);

        expect(findByIdAndDelete).toBeCalledWith(incompleteGroupMemberStreakTaskId);
        expect(response.locals.deletedIncompleteGroupMemberStreakTask).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('throws NoIncompleteGroupMemberStreakTaskToDeleteFound error when no solo streak is found', async () => {
        expect.assertions(1);
        const incompleteGroupMemberStreakTaskId = 'abc123';
        const findByIdAndDelete = jest.fn(() => Promise.resolve(false));
        const incompleteGroupMemberStreakTaskModel = {
            findByIdAndDelete,
        };
        const request: any = { params: { incompleteGroupMemberStreakTaskId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getDeleteIncompleteGroupMemberStreakTaskMiddleware(
            incompleteGroupMemberStreakTaskModel as any,
        );

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.NoIncompleteGroupMemberStreakTaskToDeleteFound));
    });

    test('calls next with DeleteIncompleteGroupMemberStreakTaskMiddleware error on failure', async () => {
        expect.assertions(1);
        const incompleteGroupMemberStreakTaskId = 'abc123';
        const error = 'error';
        const findByIdAndDelete = jest.fn(() => Promise.reject(error));
        const incompleteGroupMemberStreakTaskModel = {
            findByIdAndDelete,
        };
        const request: any = { params: { incompleteGroupMemberStreakTaskId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getDeleteIncompleteGroupMemberStreakTaskMiddleware(
            incompleteGroupMemberStreakTaskModel as any,
        );

        await middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.DeleteIncompleteGroupMemberStreakTaskMiddleware, expect.any(Error)),
        );
    });
});

describe('sendIncompleteGroupMemberStreakTaskDeletedResponseMiddleware', () => {
    test('responds with successful deletion', () => {
        expect.assertions(2);
        const successfulDeletionResponseCode = 204;
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {};
        const response: any = { status };
        const next = jest.fn();
        const middleware = getSendIncompleteGroupMemberStreakTaskDeletedResponseMiddleware(
            successfulDeletionResponseCode,
        );

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
        const middleware = getSendIncompleteGroupMemberStreakTaskDeletedResponseMiddleware(
            successfulDeletionResponseCode,
        );

        middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.SendIncompleteGroupMemberStreakTaskDeletedResponseMiddleware, expect.any(Error)),
        );
    });
});

describe('deleteIncompleteGroupMemberStreakTaskMiddlewares', () => {
    test('that deleteIncompleteGroupMemberStreakTaskMiddlewares are defined in the correct order', () => {
        expect.assertions(4);

        expect(deleteIncompleteGroupMemberStreakTaskMiddlewares.length).toEqual(3);
        expect(deleteIncompleteGroupMemberStreakTaskMiddlewares[0]).toEqual(
            incompleteGroupMemberStreakTaskParamsValidationMiddleware,
        );
        expect(deleteIncompleteGroupMemberStreakTaskMiddlewares[1]).toEqual(
            deleteIncompleteGroupMemberStreakTaskMiddleware,
        );
        expect(deleteIncompleteGroupMemberStreakTaskMiddlewares[2]).toEqual(
            sendIncompleteGroupMemberStreakTaskDeletedResponseMiddleware,
        );
    });
});
