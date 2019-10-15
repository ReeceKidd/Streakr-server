/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    deleteTeamStreakMiddlewares,
    teamStreakParamsValidationMiddleware,
    deleteTeamStreakMiddleware,
    getDeleteTeamStreakMiddleware,
    sendTeamStreakDeletedResponseMiddleware,
    getSendTeamStreakDeletedResponseMiddleware,
} from './deleteTeamStreakMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

describe('teamStreakParamsValidationMiddleware', () => {
    test('sends teamStreakId is not defined error', () => {
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

        teamStreakParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "teamStreakId" fails because ["teamStreakId" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends teamStreakId is not a string error', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: { teamStreakId: 123 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        teamStreakParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "teamStreakId" fails because ["teamStreakId" must be a string]',
        });
        expect(next).not.toBeCalled();
    });
});

describe('deleteTeamStreakMiddleware', () => {
    test('sets response.locals.deletedTeamStreak', async () => {
        expect.assertions(3);
        const teamStreakId = 'abc123';
        const findByIdAndDelete = jest.fn(() => Promise.resolve(true));
        const TeamStreakModel = {
            findByIdAndDelete,
        };
        const request: any = { params: { teamStreakId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getDeleteTeamStreakMiddleware(TeamStreakModel as any);

        await middleware(request, response, next);

        expect(findByIdAndDelete).toBeCalledWith(teamStreakId);
        expect(response.locals.deletedTeamStreak).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('throws NoTeamStreakToDeleteFound error when no team streak is found', async () => {
        expect.assertions(1);
        const teamStreakId = 'abc123';
        const findByIdAndDelete = jest.fn(() => Promise.resolve(false));
        const TeamStreakModel = {
            findByIdAndDelete,
        };
        const request: any = { params: { teamStreakId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getDeleteTeamStreakMiddleware(TeamStreakModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.NoTeamStreakToDeleteFound));
    });

    test('calls next with DeleteTeamStreakMiddleware error on failure', async () => {
        expect.assertions(1);
        const teamStreakId = 'abc123';
        const error = 'error';
        const findByIdAndDelete = jest.fn(() => Promise.reject(error));
        const teamStreakModel = {
            findByIdAndDelete,
        };
        const request: any = { params: { teamStreakId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getDeleteTeamStreakMiddleware(teamStreakModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.DeleteTeamStreakMiddleware, expect.any(Error)));
    });
});

describe('sendTeamStreakDeletedResponseMiddleware', () => {
    test('responds with successful deletion', () => {
        expect.assertions(2);
        const successfulDeletionResponseCode = 204;
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {};
        const response: any = { status };
        const next = jest.fn();
        const middleware = getSendTeamStreakDeletedResponseMiddleware(successfulDeletionResponseCode);

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
        const middleware = getSendTeamStreakDeletedResponseMiddleware(successfulDeletionResponseCode);

        middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.SendTeamStreakDeletedResponseMiddleware, expect.any(Error)),
        );
    });
});

describe('deleteTeamStreakMiddlewares', () => {
    test('that deleteTeamStreakMiddlewares are defined in the correct order', () => {
        expect.assertions(4);

        expect(deleteTeamStreakMiddlewares.length).toEqual(3);
        expect(deleteTeamStreakMiddlewares[0]).toEqual(teamStreakParamsValidationMiddleware);
        expect(deleteTeamStreakMiddlewares[1]).toEqual(deleteTeamStreakMiddleware);
        expect(deleteTeamStreakMiddlewares[2]).toEqual(sendTeamStreakDeletedResponseMiddleware);
    });
});
