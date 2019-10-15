/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    deleteIncompleteTeamMemberStreakTaskMiddlewares,
    incompleteTeamMemberStreakTaskParamsValidationMiddleware,
    deleteIncompleteTeamMemberStreakTaskMiddleware,
    getDeleteIncompleteTeamMemberStreakTaskMiddleware,
    sendIncompleteTeamMemberStreakTaskDeletedResponseMiddleware,
    getSendIncompleteTeamMemberStreakTaskDeletedResponseMiddleware,
} from './deleteIncompleteTeamMemberStreakTaskMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

describe('incompleteTeamMemberStreakTaskParamsValidationMiddleware', () => {
    test('sends incompleteTeamMemberStreakTaskId is not defined error', () => {
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

        incompleteTeamMemberStreakTaskParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message:
                'child "incompleteTeamMemberStreakTaskId" fails because ["incompleteTeamMemberStreakTaskId" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends incompleteTeamMemberStreakTaskId is not a string error', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: { incompleteTeamMemberStreakTaskId: 123 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        incompleteTeamMemberStreakTaskParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message:
                'child "incompleteTeamMemberStreakTaskId" fails because ["incompleteTeamMemberStreakTaskId" must be a string]',
        });
        expect(next).not.toBeCalled();
    });
});

describe('deleteIncompleteTeamMemberStreakTaskMiddleware', () => {
    test('sets response.locals.deletedIncompleteTeamMemberStreakTask', async () => {
        expect.assertions(3);
        const incompleteTeamMemberStreakTaskId = 'abc123';
        const findByIdAndDelete = jest.fn(() => Promise.resolve(true));
        const incompleteTeamMemberStreakTaskModel = {
            findByIdAndDelete,
        };
        const request: any = { params: { incompleteTeamMemberStreakTaskId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getDeleteIncompleteTeamMemberStreakTaskMiddleware(
            incompleteTeamMemberStreakTaskModel as any,
        );

        await middleware(request, response, next);

        expect(findByIdAndDelete).toBeCalledWith(incompleteTeamMemberStreakTaskId);
        expect(response.locals.deletedIncompleteTeamMemberStreakTask).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('throws NoIncompleteTeamMemberStreakTaskToDeleteFound error when no solo streak is found', async () => {
        expect.assertions(1);
        const incompleteTeamMemberStreakTaskId = 'abc123';
        const findByIdAndDelete = jest.fn(() => Promise.resolve(false));
        const incompleteTeamMemberStreakTaskModel = {
            findByIdAndDelete,
        };
        const request: any = { params: { incompleteTeamMemberStreakTaskId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getDeleteIncompleteTeamMemberStreakTaskMiddleware(
            incompleteTeamMemberStreakTaskModel as any,
        );

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.NoIncompleteTeamMemberStreakTaskToDeleteFound));
    });

    test('calls next with DeleteIncompleteTeamMemberStreakTaskMiddleware error on failure', async () => {
        expect.assertions(1);
        const incompleteTeamMemberStreakTaskId = 'abc123';
        const error = 'error';
        const findByIdAndDelete = jest.fn(() => Promise.reject(error));
        const incompleteTeamMemberStreakTaskModel = {
            findByIdAndDelete,
        };
        const request: any = { params: { incompleteTeamMemberStreakTaskId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getDeleteIncompleteTeamMemberStreakTaskMiddleware(
            incompleteTeamMemberStreakTaskModel as any,
        );

        await middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.DeleteIncompleteTeamMemberStreakTaskMiddleware, expect.any(Error)),
        );
    });
});

describe('sendIncompleteTeamMemberStreakTaskDeletedResponseMiddleware', () => {
    test('responds with successful deletion', () => {
        expect.assertions(2);
        const successfulDeletionResponseCode = 204;
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {};
        const response: any = { status };
        const next = jest.fn();
        const middleware = getSendIncompleteTeamMemberStreakTaskDeletedResponseMiddleware(
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
        const middleware = getSendIncompleteTeamMemberStreakTaskDeletedResponseMiddleware(
            successfulDeletionResponseCode,
        );

        middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.SendIncompleteTeamMemberStreakTaskDeletedResponseMiddleware, expect.any(Error)),
        );
    });
});

describe('deleteIncompleteTeamMemberStreakTaskMiddlewares', () => {
    test('that deleteIncompleteTeamMemberStreakTaskMiddlewares are defined in the correct order', () => {
        expect.assertions(4);

        expect(deleteIncompleteTeamMemberStreakTaskMiddlewares.length).toEqual(3);
        expect(deleteIncompleteTeamMemberStreakTaskMiddlewares[0]).toEqual(
            incompleteTeamMemberStreakTaskParamsValidationMiddleware,
        );
        expect(deleteIncompleteTeamMemberStreakTaskMiddlewares[1]).toEqual(
            deleteIncompleteTeamMemberStreakTaskMiddleware,
        );
        expect(deleteIncompleteTeamMemberStreakTaskMiddlewares[2]).toEqual(
            sendIncompleteTeamMemberStreakTaskDeletedResponseMiddleware,
        );
    });
});
