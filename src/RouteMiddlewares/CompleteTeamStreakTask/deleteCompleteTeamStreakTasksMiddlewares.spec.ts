/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    deleteCompleteTeamStreakTaskMiddlewares,
    completeTeamStreakTaskParamsValidationMiddleware,
    deleteCompleteTeamStreakTaskMiddleware,
    getDeleteCompleteTeamStreakTaskMiddleware,
    sendCompleteTeamStreakTaskDeletedResponseMiddleware,
} from './deleteCompleteTeamStreakTasksMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

describe('completeTeamStreakTaskParamsValidationMiddleware', () => {
    test('sends completeTeamStreakTaskId is not defined error', () => {
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

        completeTeamStreakTaskParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "completeTeamStreakTaskId" fails because ["completeTeamStreakTaskId" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends completeTeamStreakTaskId is not a string error', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: { completeTeamStreakTaskId: 123 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        completeTeamStreakTaskParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "completeTeamStreakTaskId" fails because ["completeTeamStreakTaskId" must be a string]',
        });
        expect(next).not.toBeCalled();
    });
});

describe('deleteCompleteTeamStreakTaskMiddleware', () => {
    test('sets response.locals.deletedCompleteTeamStreakTask', async () => {
        expect.assertions(3);
        const completeTeamStreakTaskId = 'abc123';
        const findByIdAndDelete = jest.fn(() => Promise.resolve(true));
        const completeTeamStreakTaskModel = {
            findByIdAndDelete,
        };
        const request: any = { params: { completeTeamStreakTaskId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getDeleteCompleteTeamStreakTaskMiddleware(completeTeamStreakTaskModel as any);

        await middleware(request, response, next);

        expect(findByIdAndDelete).toBeCalledWith(completeTeamStreakTaskId);
        expect(response.locals.deletedCompleteTeamStreakTask).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('throws NoCompleteTeamStreakTaskToDeleteFound error when no solo streak is found', async () => {
        expect.assertions(1);
        const completeTeamStreakTaskId = 'abc123';
        const findByIdAndDelete = jest.fn(() => Promise.resolve(false));
        const completeTeamStreakTaskModel = {
            findByIdAndDelete,
        };
        const request: any = { params: { completeTeamStreakTaskId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getDeleteCompleteTeamStreakTaskMiddleware(completeTeamStreakTaskModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.NoCompleteTeamStreakTaskToDeleteFound));
    });

    test('calls next with DeleteCompleteTeamStreakTaskMiddleware error on failure', async () => {
        expect.assertions(1);
        const completeTeamStreakTaskId = 'abc123';
        const error = 'error';
        const findByIdAndDelete = jest.fn(() => Promise.reject(error));
        const completeTeamStreakTaskModel = {
            findByIdAndDelete,
        };
        const request: any = { params: { completeTeamStreakTaskId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getDeleteCompleteTeamStreakTaskMiddleware(completeTeamStreakTaskModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.DeleteCompleteTeamStreakTaskMiddleware, expect.any(Error)),
        );
    });
});

describe('sendCompleteTeamStreakTaskDeletedResponseMiddleware', () => {
    test('responds with successful deletion', () => {
        expect.assertions(2);
        const successfulDeletionResponseCode = 204;
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {};
        const response: any = { status };
        const next = jest.fn();

        sendCompleteTeamStreakTaskDeletedResponseMiddleware(request, response, next);

        expect(status).toBeCalledWith(successfulDeletionResponseCode);
        expect(next).not.toBeCalled();
    });

    test('that on error next is called with error', () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();

        sendCompleteTeamStreakTaskDeletedResponseMiddleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.SendCompleteTeamStreakTaskDeletedResponseMiddleware, expect.any(Error)),
        );
    });
});

describe('deleteCompleteTeamStreakTaskMiddlewares', () => {
    test('that deleteCompleteTeamStreakTaskMiddlewares are defined in the correct order', () => {
        expect.assertions(4);

        expect(deleteCompleteTeamStreakTaskMiddlewares.length).toEqual(3);
        expect(deleteCompleteTeamStreakTaskMiddlewares[0]).toEqual(completeTeamStreakTaskParamsValidationMiddleware);
        expect(deleteCompleteTeamStreakTaskMiddlewares[1]).toEqual(deleteCompleteTeamStreakTaskMiddleware);
        expect(deleteCompleteTeamStreakTaskMiddlewares[2]).toEqual(sendCompleteTeamStreakTaskDeletedResponseMiddleware);
    });
});
