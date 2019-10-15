/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    deleteCompleteTeamMemberStreakTaskMiddlewares,
    completeTeamMemberStreakTaskParamsValidationMiddleware,
    deleteCompleteTeamMemberStreakTaskMiddleware,
    getDeleteCompleteTeamMemberStreakTaskMiddleware,
    sendCompleteTeamMemberStreakTaskDeletedResponseMiddleware,
    getSendCompleteTeamMemberStreakTaskDeletedResponseMiddleware,
} from './deleteTeamMemberStreakTaskMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

describe('completeTeamMemberStreakTaskParamsValidationMiddleware', () => {
    test('sends completeTeamMemberStreakTaskId is not defined error', () => {
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

        completeTeamMemberStreakTaskParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message:
                'child "completeTeamMemberStreakTaskId" fails because ["completeTeamMemberStreakTaskId" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends completeTeamMemberStreakTaskId is not a string error', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: { completeTeamMemberStreakTaskId: 123 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        completeTeamMemberStreakTaskParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message:
                'child "completeTeamMemberStreakTaskId" fails because ["completeTeamMemberStreakTaskId" must be a string]',
        });
        expect(next).not.toBeCalled();
    });
});

describe('deleteCompleteTeamMemberStreakTaskMiddleware', () => {
    test('sets response.locals.deletedCompleteTeamMemberStreakTask', async () => {
        expect.assertions(3);
        const completeTeamMemberStreakTaskId = 'abc123';
        const findByIdAndDelete = jest.fn(() => Promise.resolve(true));
        const completeTeamMemberStreakTaskModel = {
            findByIdAndDelete,
        };
        const request: any = { params: { completeTeamMemberStreakTaskId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getDeleteCompleteTeamMemberStreakTaskMiddleware(completeTeamMemberStreakTaskModel as any);

        await middleware(request, response, next);

        expect(findByIdAndDelete).toBeCalledWith(completeTeamMemberStreakTaskId);
        expect(response.locals.deletedCompleteTeamMemberStreakTask).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('throws NoCompleteTeamMemberStreakTaskToDeleteFound error when no team member streak is found', async () => {
        expect.assertions(1);
        const completeTeamMemberStreakTaskId = 'abc123';
        const findByIdAndDelete = jest.fn(() => Promise.resolve(false));
        const completeTeamMemberStreakTaskModel = {
            findByIdAndDelete,
        };
        const request: any = { params: { completeTeamMemberStreakTaskId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getDeleteCompleteTeamMemberStreakTaskMiddleware(completeTeamMemberStreakTaskModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.NoCompleteTeamMemberStreakTaskToDeleteFound));
    });

    test('calls next with DeleteCompleteTeamMemberStreakTaskMiddleware error on failure', async () => {
        expect.assertions(1);
        const completeTeamMemberStreakTaskId = 'abc123';
        const error = 'error';
        const findByIdAndDelete = jest.fn(() => Promise.reject(error));
        const completeTeamMemberStreakTaskModel = {
            findByIdAndDelete,
        };
        const request: any = { params: { completeTeamMemberStreakTaskId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getDeleteCompleteTeamMemberStreakTaskMiddleware(completeTeamMemberStreakTaskModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.DeleteCompleteTeamMemberStreakTaskMiddleware, expect.any(Error)),
        );
    });
});

describe('sendCompleteTeamMemberStreakTaskDeletedResponseMiddleware', () => {
    test('responds with successful deletion', () => {
        expect.assertions(2);
        const successfulDeletionResponseCode = 204;
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {};
        const response: any = { status };
        const next = jest.fn();
        const middleware = getSendCompleteTeamMemberStreakTaskDeletedResponseMiddleware(successfulDeletionResponseCode);

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
        const middleware = getSendCompleteTeamMemberStreakTaskDeletedResponseMiddleware(successfulDeletionResponseCode);

        middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.SendCompleteTeamMemberStreakTaskDeletedResponseMiddleware, expect.any(Error)),
        );
    });
});

describe('deleteCompleteTeamMemberStreakTaskMiddlewares', () => {
    test('that deleteCompleteTeamMemberStreakTaskMiddlewares are defined in the correct order', () => {
        expect.assertions(4);

        expect(deleteCompleteTeamMemberStreakTaskMiddlewares.length).toEqual(3);
        expect(deleteCompleteTeamMemberStreakTaskMiddlewares[0]).toEqual(
            completeTeamMemberStreakTaskParamsValidationMiddleware,
        );
        expect(deleteCompleteTeamMemberStreakTaskMiddlewares[1]).toEqual(deleteCompleteTeamMemberStreakTaskMiddleware);
        expect(deleteCompleteTeamMemberStreakTaskMiddlewares[2]).toEqual(
            sendCompleteTeamMemberStreakTaskDeletedResponseMiddleware,
        );
    });
});
