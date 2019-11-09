/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    getOneTeamMemberStreakMiddlewares,
    retreiveTeamMemberStreakMiddleware,
    getRetreiveTeamMemberStreakMiddleware,
    sendTeamMemberStreakMiddleware,
    getTeamMemberStreakParamsValidationMiddleware,
    getSendTeamMemberStreakMiddleware,
} from './getOneTeamMemberStreakMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { ErrorType, CustomError } from '../../customError';

describe(`getTeamMemberStreakParamsValidationMiddleware`, () => {
    const teamMemberStreakId = '12345678';

    test('calls next() when correct params are supplied', () => {
        expect.assertions(1);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: { teamMemberStreakId },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        getTeamMemberStreakParamsValidationMiddleware(request, response, next);

        expect(next).toBeCalled();
    });

    test('sends error response when teamMemberStreakId is missing', () => {
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

        getTeamMemberStreakParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "teamMemberStreakId" fails because ["teamMemberStreakId" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends error response when teamMemberStreakId is not a string', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: { teamMemberStreakId: 1234 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        getTeamMemberStreakParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "teamMemberStreakId" fails because ["teamMemberStreakId" must be a string]',
        });
        expect(next).not.toBeCalled();
    });
});

describe('retreiveTeamMemberStreakMiddleware', () => {
    test('sets response.locals.teamMemberStreak', async () => {
        expect.assertions(3);
        const lean = jest.fn(() => Promise.resolve(true));
        const findOne = jest.fn(() => ({ lean }));
        const teamMemberStreakModel = {
            findOne,
        };
        const teamMemberStreakId = 'abcd';
        const request: any = { params: { teamMemberStreakId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetreiveTeamMemberStreakMiddleware(teamMemberStreakModel as any);

        await middleware(request, response, next);

        expect(findOne).toBeCalledWith({ _id: teamMemberStreakId });
        expect(response.locals.teamMemberStreak).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('throws GetTeamMemberStreakNoTeamMemberStreakFound when solo streak is not found', async () => {
        expect.assertions(1);
        const lean = jest.fn(() => Promise.resolve(false));
        const findOne = jest.fn(() => ({ lean }));
        const teamMemberStreakModel = {
            findOne,
        };
        const teamMemberStreakId = 'abcd';
        const request: any = { params: { teamMemberStreakId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetreiveTeamMemberStreakMiddleware(teamMemberStreakModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.GetTeamMemberStreakNoTeamMemberStreakFound));
    });

    test('calls next with RetreiveTeamMemberStreakMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const errorMessage = 'error';
        const lean = jest.fn(() => Promise.reject(errorMessage));
        const findOne = jest.fn(() => ({ lean }));
        const teamMemberStreakModel = {
            findOne,
        };
        const teamMemberStreakId = 'abcd';
        const request: any = { params: { teamMemberStreakId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetreiveTeamMemberStreakMiddleware(teamMemberStreakModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.RetreiveTeamMemberStreakMiddleware, expect.any(Error)));
    });
});

describe('sendTeamMemberStreakMiddleware', () => {
    test('sends teamMemberStreak', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const teamMemberStreak = { _id: 'abc' };
        const request: any = {};
        const response: any = { locals: { teamMemberStreak }, status };
        const next = jest.fn();
        const resourceCreatedCode = 401;
        const middleware = getSendTeamMemberStreakMiddleware(resourceCreatedCode);

        middleware(request, response, next);

        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(resourceCreatedCode);
        expect(send).toBeCalledWith(teamMemberStreak);
    });

    test('calls next with SendTeamMemberStreakMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const error = 'error';
        const send = jest.fn(() => Promise.reject(error));
        const status = jest.fn(() => ({ send }));
        const response: any = { status };
        const next = jest.fn();
        const resourceCreatedResponseCode = 401;
        const middleware = getSendTeamMemberStreakMiddleware(resourceCreatedResponseCode);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendTeamMemberStreakMiddleware, expect.any(Error)));
    });
});

describe('getTeamMemberStreakMiddlewares', () => {
    test('that getTeamMemberStreakMiddlewares are defined in the correct order', () => {
        expect.assertions(4);

        expect(getOneTeamMemberStreakMiddlewares.length).toEqual(3);
        expect(getOneTeamMemberStreakMiddlewares[0]).toEqual(getTeamMemberStreakParamsValidationMiddleware);
        expect(getOneTeamMemberStreakMiddlewares[1]).toEqual(retreiveTeamMemberStreakMiddleware);
        expect(getOneTeamMemberStreakMiddlewares[2]).toEqual(sendTeamMemberStreakMiddleware);
    });
});
