/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    userParamsValidationMiddleware,
    getRetreiveUserMiddleware,
    sendUserMiddleware,
    getUserMiddlewares,
    retreiveUserMiddleware,
    formatUserMiddleware,
} from './getUserMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { ErrorType, CustomError } from '../../customError';

describe(`userParamsValidationMiddleware`, () => {
    const userId = '5d43f0c2f4499975cb312b72';

    test('calls next() when correct params are supplied', () => {
        expect.assertions(1);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: { userId },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        userParamsValidationMiddleware(request, response, next);

        expect(next).toBeCalled();
    });

    test('sends error response when userId is missing', () => {
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

        userParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "userId" fails because ["userId" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends error response when userId is not a string', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: { userId: 1234 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        userParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "userId" fails because ["userId" must be a string]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends error response when userId is not 24 characters in length', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: { userId: '1234567' },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        userParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "userId" fails because ["userId" length must be 24 characters long]',
        });
        expect(next).not.toBeCalled();
    });
});

describe('retreiveUserMiddleware', () => {
    test('sets response.locals.user', async () => {
        expect.assertions(3);
        const findOne = jest.fn().mockResolvedValue(true);
        const userModel = {
            findOne,
        };
        const userId = 'abcd';
        const request: any = { params: { userId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetreiveUserMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(findOne).toBeCalledWith({ _id: userId });
        expect(response.locals.user).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('throws NoUserFound when user is not found', async () => {
        expect.assertions(1);
        const findOne = jest.fn().mockResolvedValue(false);
        const userModel = {
            findOne,
        };
        const userId = 'abcd';
        const request: any = { params: { userId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetreiveUserMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.NoUserFound, expect.any(Error)));
    });

    test('calls next with GetRetreiveUserMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const errorMessage = 'error';
        const findOne = jest.fn().mockRejectedValue(errorMessage);
        const userModel = {
            findOne,
        };
        const userId = 'abcd';
        const request: any = { params: { userId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetreiveUserMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.RetreiveUserMiddleware, expect.any(Error)));
    });
});

describe('sendRetreiveUserResponseMiddleware', () => {
    test('sends user', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const user = { _id: 'abc' };
        const request: any = {};
        const response: any = { locals: { user }, status };
        const next = jest.fn();

        sendUserMiddleware(request, response, next);

        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(200);
        expect(send).toBeCalledWith(user);
    });

    test('calls next with SendRetreiveUserResponseMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const error = 'error';
        const send = jest.fn(() => Promise.reject(error));
        const status = jest.fn(() => ({ send }));
        const response: any = { status };
        const next = jest.fn();

        await sendUserMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendUserMiddleware, expect.any(Error)));
    });
});

describe('formatUserMiddleware', () => {
    test('sends users in response', () => {
        expect.assertions(2);
        const request: any = {};
        const _id = '_id';
        const username = 'username';
        const email = 'email';
        const user = {
            _id,
            username,
            email,
        };
        const response: any = { locals: { user } };
        const next = jest.fn();

        formatUserMiddleware(request, response, next);

        expect(next).toBeCalled();
        expect(response.locals.user.email).toBeUndefined();
    });

    test('calls next with FormatUserMiddleware error on middleware failure', () => {
        expect.assertions(1);
        const response: any = {};
        const request: any = {};
        const next = jest.fn();

        formatUserMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.FormatUserMiddleware, expect.any(Error)));
    });
});

describe('getUserMiddlewares', () => {
    test('are defined in the correct order', () => {
        expect.assertions(5);

        expect(getUserMiddlewares.length).toEqual(4);
        expect(getUserMiddlewares[0]).toEqual(userParamsValidationMiddleware);
        expect(getUserMiddlewares[1]).toEqual(retreiveUserMiddleware);
        expect(getUserMiddlewares[2]).toEqual(formatUserMiddleware);
        expect(getUserMiddlewares[3]).toEqual(sendUserMiddleware);
    });
});
