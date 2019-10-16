/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    deleteCompleteTeamStreakMiddlewares,
    completeTeamStreakParamsValidationMiddleware,
    deleteCompleteTeamStreakMiddleware,
    getDeleteCompleteTeamStreakMiddleware,
    sendCompleteTeamStreakDeletedResponseMiddleware,
} from './deleteCompleteTeamStreaksMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

describe('completeTeamStreakParamsValidationMiddleware', () => {
    test('sends completeTeamStreakId is not defined error', () => {
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

        completeTeamStreakParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "completeTeamStreakId" fails because ["completeTeamStreakId" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends completeTeamStreakId is not a string error', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: { completeTeamStreakId: 123 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        completeTeamStreakParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "completeTeamStreakId" fails because ["completeTeamStreakId" must be a string]',
        });
        expect(next).not.toBeCalled();
    });
});

describe('deleteCompleteTeamStreakMiddleware', () => {
    test('sets response.locals.deletedCompleteTeamStreak', async () => {
        expect.assertions(3);
        const completeTeamStreakId = 'abc123';
        const findByIdAndDelete = jest.fn(() => Promise.resolve(true));
        const completeTeamStreakModel = {
            findByIdAndDelete,
        };
        const request: any = { params: { completeTeamStreakId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getDeleteCompleteTeamStreakMiddleware(completeTeamStreakModel as any);

        await middleware(request, response, next);

        expect(findByIdAndDelete).toBeCalledWith(completeTeamStreakId);
        expect(response.locals.deletedCompleteTeamStreak).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('throws NoCompleteTeamStreakToDeleteFound error when no solo streak is found', async () => {
        expect.assertions(1);
        const completeTeamStreakId = 'abc123';
        const findByIdAndDelete = jest.fn(() => Promise.resolve(false));
        const completeTeamStreakModel = {
            findByIdAndDelete,
        };
        const request: any = { params: { completeTeamStreakId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getDeleteCompleteTeamStreakMiddleware(completeTeamStreakModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.NoCompleteTeamStreakToDeleteFound));
    });

    test('calls next with DeleteCompleteTeamStreakMiddleware error on failure', async () => {
        expect.assertions(1);
        const completeTeamStreakId = 'abc123';
        const error = 'error';
        const findByIdAndDelete = jest.fn(() => Promise.reject(error));
        const completeTeamStreakModel = {
            findByIdAndDelete,
        };
        const request: any = { params: { completeTeamStreakId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getDeleteCompleteTeamStreakMiddleware(completeTeamStreakModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.DeleteCompleteTeamStreakMiddleware, expect.any(Error)));
    });
});

describe('sendCompleteTeamStreakDeletedResponseMiddleware', () => {
    test('responds with successful deletion', () => {
        expect.assertions(2);
        const successfulDeletionResponseCode = 204;
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {};
        const response: any = { status };
        const next = jest.fn();

        sendCompleteTeamStreakDeletedResponseMiddleware(request, response, next);

        expect(status).toBeCalledWith(successfulDeletionResponseCode);
        expect(next).not.toBeCalled();
    });

    test('that on error next is called with error', () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();

        sendCompleteTeamStreakDeletedResponseMiddleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.SendCompleteTeamStreakDeletedResponseMiddleware, expect.any(Error)),
        );
    });
});

describe('deleteCompleteTeamStreakMiddlewares', () => {
    test('that deleteCompleteTeamStreakMiddlewares are defined in the correct order', () => {
        expect.assertions(4);

        expect(deleteCompleteTeamStreakMiddlewares.length).toEqual(3);
        expect(deleteCompleteTeamStreakMiddlewares[0]).toEqual(completeTeamStreakParamsValidationMiddleware);
        expect(deleteCompleteTeamStreakMiddlewares[1]).toEqual(deleteCompleteTeamStreakMiddleware);
        expect(deleteCompleteTeamStreakMiddlewares[2]).toEqual(sendCompleteTeamStreakDeletedResponseMiddleware);
    });
});
