/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    getOneGroupMemberStreakMiddlewares,
    retreiveGroupMemberStreakMiddleware,
    getRetreiveGroupMemberStreakMiddleware,
    sendGroupMemberStreakMiddleware,
    getGroupMemberStreakParamsValidationMiddleware,
    getSendGroupMemberStreakMiddleware,
} from './getOneGroupMemberStreakMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { ErrorType, CustomError } from '../../customError';

describe(`getGroupMemberStreakParamsValidationMiddleware`, () => {
    const groupMemberStreakId = '12345678';

    test('calls next() when correct params are supplied', () => {
        expect.assertions(1);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: { groupMemberStreakId },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        getGroupMemberStreakParamsValidationMiddleware(request, response, next);

        expect(next).toBeCalled();
    });

    test('sends error response when groupMemberStreakId is missing', () => {
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

        getGroupMemberStreakParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "groupMemberStreakId" fails because ["groupMemberStreakId" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends error response when groupMemberStreakId is not a string', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: { groupMemberStreakId: 1234 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        getGroupMemberStreakParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "groupMemberStreakId" fails because ["groupMemberStreakId" must be a string]',
        });
        expect(next).not.toBeCalled();
    });
});

describe('retreiveGroupMemberStreakMiddleware', () => {
    test('sets response.locals.groupMemberStreak', async () => {
        expect.assertions(3);
        const lean = jest.fn(() => Promise.resolve(true));
        const findOne = jest.fn(() => ({ lean }));
        const groupMemberStreakModel = {
            findOne,
        };
        const groupMemberStreakId = 'abcd';
        const request: any = { params: { groupMemberStreakId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetreiveGroupMemberStreakMiddleware(groupMemberStreakModel as any);

        await middleware(request, response, next);

        expect(findOne).toBeCalledWith({ _id: groupMemberStreakId });
        expect(response.locals.groupMemberStreak).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('throws GetGroupMemberStreakNoGroupMemberStreakFound when solo streak is not found', async () => {
        expect.assertions(1);
        const lean = jest.fn(() => Promise.resolve(false));
        const findOne = jest.fn(() => ({ lean }));
        const groupMemberStreakModel = {
            findOne,
        };
        const groupMemberStreakId = 'abcd';
        const request: any = { params: { groupMemberStreakId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetreiveGroupMemberStreakMiddleware(groupMemberStreakModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.GetGroupMemberStreakNoGroupMemberStreakFound));
    });

    test('calls next with RetreiveGroupMemberStreakMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const errorMessage = 'error';
        const lean = jest.fn(() => Promise.reject(errorMessage));
        const findOne = jest.fn(() => ({ lean }));
        const groupMemberStreakModel = {
            findOne,
        };
        const groupMemberStreakId = 'abcd';
        const request: any = { params: { groupMemberStreakId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetreiveGroupMemberStreakMiddleware(groupMemberStreakModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.RetreiveGroupMemberStreakMiddleware, expect.any(Error)));
    });
});

describe('sendGroupMemberStreakMiddleware', () => {
    test('sends groupMemberStreak', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const groupMemberStreak = { _id: 'abc' };
        const request: any = {};
        const response: any = { locals: { groupMemberStreak }, status };
        const next = jest.fn();
        const resourceCreatedCode = 401;
        const middleware = getSendGroupMemberStreakMiddleware(resourceCreatedCode);

        middleware(request, response, next);

        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(resourceCreatedCode);
        expect(send).toBeCalledWith(groupMemberStreak);
    });

    test('calls next with SendGroupMemberStreakMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const error = 'error';
        const send = jest.fn(() => Promise.reject(error));
        const status = jest.fn(() => ({ send }));
        const response: any = { status };
        const next = jest.fn();
        const resourceCreatedResponseCode = 401;
        const middleware = getSendGroupMemberStreakMiddleware(resourceCreatedResponseCode);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendGroupMemberStreakMiddleware, expect.any(Error)));
    });
});

describe('getGroupMemberStreakMiddlewares', () => {
    test('that getGroupMemberStreakMiddlewares are defined in the correct order', () => {
        expect.assertions(4);

        expect(getOneGroupMemberStreakMiddlewares.length).toEqual(3);
        expect(getOneGroupMemberStreakMiddlewares[0]).toEqual(getGroupMemberStreakParamsValidationMiddleware);
        expect(getOneGroupMemberStreakMiddlewares[1]).toEqual(retreiveGroupMemberStreakMiddleware);
        expect(getOneGroupMemberStreakMiddlewares[2]).toEqual(sendGroupMemberStreakMiddleware);
    });
});
