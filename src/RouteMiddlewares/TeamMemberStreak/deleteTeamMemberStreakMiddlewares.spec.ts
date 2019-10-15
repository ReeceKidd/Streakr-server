/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    deleteTeamMemberStreakMiddlewares,
    teamMemberStreakParamsValidationMiddleware,
    deleteTeamMemberStreakMiddleware,
    getDeleteTeamMemberStreakMiddleware,
    sendTeamMemberStreakDeletedResponseMiddleware,
    getSendTeamMemberStreakDeletedResponseMiddleware,
} from './deleteTeamMemberStreakMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

describe('teamMemberStreakParamsValidationMiddleware', () => {
    test('sends teamMemberStreakId is not defined error', () => {
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

        teamMemberStreakParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "teamMemberStreakId" fails because ["teamMemberStreakId" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends teamMemberStreakId is not a string error', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: { teamMemberStreakId: 123 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        teamMemberStreakParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "teamMemberStreakId" fails because ["teamMemberStreakId" must be a string]',
        });
        expect(next).not.toBeCalled();
    });
});

describe('deleteTeamMemberStreakMiddleware', () => {
    test('sets response.locals.deletedTeamMemberStreak', async () => {
        expect.assertions(3);
        const teamMemberStreakId = 'abc123';
        const findByIdAndDelete = jest.fn(() => Promise.resolve(true));
        const teamMemberStreakModel = {
            findByIdAndDelete,
        };
        const request: any = { params: { teamMemberStreakId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getDeleteTeamMemberStreakMiddleware(teamMemberStreakModel as any);

        await middleware(request, response, next);

        expect(findByIdAndDelete).toBeCalledWith(teamMemberStreakId);
        expect(response.locals.deletedTeamMemberStreak).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('throws NoTeamMemberStreakToDeleteFound error when no solo streak is found', async () => {
        expect.assertions(1);
        const teamMemberStreakId = 'abc123';
        const findByIdAndDelete = jest.fn(() => Promise.resolve(false));
        const teamMemberStreakModel = {
            findByIdAndDelete,
        };
        const request: any = { params: { teamMemberStreakId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getDeleteTeamMemberStreakMiddleware(teamMemberStreakModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.NoTeamMemberStreakToDeleteFound));
    });

    test('calls next with DeleteTeamMemberStreakMiddleware error on failure', async () => {
        expect.assertions(1);
        const teamMemberStreakId = 'abc123';
        const error = 'error';
        const findByIdAndDelete = jest.fn(() => Promise.reject(error));
        const teamMemberStreakModel = {
            findByIdAndDelete,
        };
        const request: any = { params: { teamMemberStreakId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getDeleteTeamMemberStreakMiddleware(teamMemberStreakModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.DeleteTeamMemberStreakMiddleware, expect.any(Error)));
    });
});

describe('sendTeamMemberStreakDeletedResponseMiddleware', () => {
    test('responds with successful deletion', () => {
        expect.assertions(2);
        const successfulDeletionResponseCode = 204;
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {};
        const response: any = { status };
        const next = jest.fn();
        const middleware = getSendTeamMemberStreakDeletedResponseMiddleware(successfulDeletionResponseCode);

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
        const middleware = getSendTeamMemberStreakDeletedResponseMiddleware(successfulDeletionResponseCode);

        middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.SendTeamMemberStreakDeletedResponseMiddleware, expect.any(Error)),
        );
    });
});

describe('deleteTeamMemberStreakMiddlewares', () => {
    test('that deleteTeamMemberStreakMiddlewares are defined in the correct order', () => {
        expect.assertions(4);

        expect(deleteTeamMemberStreakMiddlewares.length).toEqual(3);
        expect(deleteTeamMemberStreakMiddlewares[0]).toEqual(teamMemberStreakParamsValidationMiddleware);
        expect(deleteTeamMemberStreakMiddlewares[1]).toEqual(deleteTeamMemberStreakMiddleware);
        expect(deleteTeamMemberStreakMiddlewares[2]).toEqual(sendTeamMemberStreakDeletedResponseMiddleware);
    });
});
