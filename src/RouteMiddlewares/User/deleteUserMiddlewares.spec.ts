/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    deleteUserMiddlewares,
    deleteUserParamsValidationMiddleware,
    deleteUserMiddleware,
    getDeleteUserMiddleware,
    sendUserDeletedResponseMiddleware,
} from './deleteUserMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

describe('deleteUserParamsValidationMiddleware', () => {
    test('sends userId is not defined error', () => {
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

        deleteUserParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "userId" fails because ["userId" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends userId is not a string error', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: { userId: 123 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        deleteUserParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "userId" fails because ["userId" must be a string]',
        });
        expect(next).not.toBeCalled();
    });
});

describe('deleteUserMiddleware', () => {
    test('sets response.locals.deletedUser', async () => {
        expect.assertions(3);
        const userId = 'abc123';
        const findByIdAndDelete = jest.fn(() => Promise.resolve(true));
        const userModel = {
            findByIdAndDelete,
        };
        const request: any = { params: { userId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getDeleteUserMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(findByIdAndDelete).toBeCalledWith(userId);
        expect(response.locals.deletedUser).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('throws NoUserToDeleteFound error when no solo streak is found', async () => {
        expect.assertions(1);
        const userId = 'abc123';
        const findByIdAndDelete = jest.fn(() => Promise.resolve(false));
        const userModel = {
            findByIdAndDelete,
        };
        const request: any = { params: { userId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getDeleteUserMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.NoUserToDeleteFound));
    });

    test('calls next with DeleteUserMiddleware error on failure', async () => {
        expect.assertions(1);
        const userId = 'abc123';
        const error = 'error';
        const findByIdAndDelete = jest.fn(() => Promise.reject(error));
        const userModel = {
            findByIdAndDelete,
        };
        const request: any = { params: { userId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getDeleteUserMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.DeleteUserMiddleware, expect.any(Error)));
    });
});

describe('sendUserDeletedResponseMiddleware', () => {
    test('responds with successful deletion', () => {
        expect.assertions(2);

        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {};
        const response: any = { status };
        const next = jest.fn();

        sendUserDeletedResponseMiddleware(request, response, next);

        expect(status).toBeCalledWith(204);
        expect(next).not.toBeCalled();
    });

    test('that on error next is called with error', () => {
        expect.assertions(1);

        const request: any = {};
        const response: any = {};
        const next = jest.fn();

        sendUserDeletedResponseMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendUserDeletedResponseMiddleware, expect.any(Error)));
    });
});

describe('deleteUserMiddlewares', () => {
    test('that deleteUserMiddlewares are defined in the correct order', () => {
        expect.assertions(4);

        expect(deleteUserMiddlewares.length).toEqual(3);
        expect(deleteUserMiddlewares[0]).toEqual(deleteUserParamsValidationMiddleware);
        expect(deleteUserMiddlewares[1]).toEqual(deleteUserMiddleware);
        expect(deleteUserMiddlewares[2]).toEqual(sendUserDeletedResponseMiddleware);
    });
});
