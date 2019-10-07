/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    deleteCompleteGroupMemberStreakTaskMiddlewares,
    completeGroupMemberStreakTaskParamsValidationMiddleware,
    deleteCompleteGroupMemberStreakTaskMiddleware,
    getDeleteCompleteGroupMemberStreakTaskMiddleware,
    sendCompleteGroupMemberStreakTaskDeletedResponseMiddleware,
    getSendCompleteGroupMemberStreakTaskDeletedResponseMiddleware,
} from './deleteGroupMemberStreakTaskMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

describe('completeGroupMemberStreakTaskParamsValidationMiddleware', () => {
    test('sends completeGroupMemberStreakTaskId is not defined error', () => {
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

        completeGroupMemberStreakTaskParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message:
                'child "completeGroupMemberStreakTaskId" fails because ["completeGroupMemberStreakTaskId" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends completeGroupMemberStreakTaskId is not a string error', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: { completeGroupMemberStreakTaskId: 123 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        completeGroupMemberStreakTaskParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message:
                'child "completeGroupMemberStreakTaskId" fails because ["completeGroupMemberStreakTaskId" must be a string]',
        });
        expect(next).not.toBeCalled();
    });
});

describe('deleteCompleteGroupMemberStreakTaskMiddleware', () => {
    test('sets response.locals.deletedCompleteGroupMemberStreakTask', async () => {
        expect.assertions(3);
        const completeGroupMemberStreakTaskId = 'abc123';
        const findByIdAndDelete = jest.fn(() => Promise.resolve(true));
        const completeGroupMemberStreakTaskModel = {
            findByIdAndDelete,
        };
        const request: any = { params: { completeGroupMemberStreakTaskId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getDeleteCompleteGroupMemberStreakTaskMiddleware(completeGroupMemberStreakTaskModel as any);

        await middleware(request, response, next);

        expect(findByIdAndDelete).toBeCalledWith(completeGroupMemberStreakTaskId);
        expect(response.locals.deletedCompleteGroupMemberStreakTask).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('throws NoCompleteGroupMemberStreakTaskToDeleteFound error when no group member streak is found', async () => {
        expect.assertions(1);
        const completeGroupMemberStreakTaskId = 'abc123';
        const findByIdAndDelete = jest.fn(() => Promise.resolve(false));
        const completeGroupMemberStreakTaskModel = {
            findByIdAndDelete,
        };
        const request: any = { params: { completeGroupMemberStreakTaskId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getDeleteCompleteGroupMemberStreakTaskMiddleware(completeGroupMemberStreakTaskModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.NoCompleteGroupMemberStreakTaskToDeleteFound));
    });

    test('calls next with DeleteCompleteGroupMemberStreakTaskMiddleware error on failure', async () => {
        expect.assertions(1);
        const completeGroupMemberStreakTaskId = 'abc123';
        const error = 'error';
        const findByIdAndDelete = jest.fn(() => Promise.reject(error));
        const completeGroupMemberStreakTaskModel = {
            findByIdAndDelete,
        };
        const request: any = { params: { completeGroupMemberStreakTaskId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getDeleteCompleteGroupMemberStreakTaskMiddleware(completeGroupMemberStreakTaskModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.DeleteCompleteGroupMemberStreakTaskMiddleware, expect.any(Error)),
        );
    });
});

describe('sendCompleteGroupMemberStreakTaskDeletedResponseMiddleware', () => {
    test('responds with successful deletion', () => {
        expect.assertions(2);
        const successfulDeletionResponseCode = 204;
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {};
        const response: any = { status };
        const next = jest.fn();
        const middleware = getSendCompleteGroupMemberStreakTaskDeletedResponseMiddleware(
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
        const middleware = getSendCompleteGroupMemberStreakTaskDeletedResponseMiddleware(
            successfulDeletionResponseCode,
        );

        middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.SendCompleteGroupMemberStreakTaskDeletedResponseMiddleware, expect.any(Error)),
        );
    });
});

describe('deleteCompleteGroupMemberStreakTaskMiddlewares', () => {
    test('that deleteCompleteGroupMemberStreakTaskMiddlewares are defined in the correct order', () => {
        expect.assertions(4);

        expect(deleteCompleteGroupMemberStreakTaskMiddlewares.length).toEqual(3);
        expect(deleteCompleteGroupMemberStreakTaskMiddlewares[0]).toEqual(
            completeGroupMemberStreakTaskParamsValidationMiddleware,
        );
        expect(deleteCompleteGroupMemberStreakTaskMiddlewares[1]).toEqual(
            deleteCompleteGroupMemberStreakTaskMiddleware,
        );
        expect(deleteCompleteGroupMemberStreakTaskMiddlewares[2]).toEqual(
            sendCompleteGroupMemberStreakTaskDeletedResponseMiddleware,
        );
    });
});
