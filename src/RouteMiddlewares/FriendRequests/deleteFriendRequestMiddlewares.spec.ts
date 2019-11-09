/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    deleteFriendRequestMiddlewares,
    friendRequestParamsValidationMiddleware,
    deleteFriendRequestMiddleware,
    getDeleteFriendRequestMiddleware,
    sendFriendRequestDeletedResponseMiddleware,
    getSendFriendRequestDeletedResponseMiddleware,
} from './deleteFriendRequestMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

describe('friendRequestParamsValidationMiddleware', () => {
    test('sends friendRequestId is not defined error', () => {
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

        friendRequestParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "friendRequestId" fails because ["friendRequestId" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends friendRequestId is not a string error', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: { friendRequestId: 123 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        friendRequestParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "friendRequestId" fails because ["friendRequestId" must be a string]',
        });
        expect(next).not.toBeCalled();
    });
});

describe('deleteFriendRequestMiddleware', () => {
    test('sets response.locals.deletedFriendRequest', async () => {
        expect.assertions(3);
        const friendRequestId = 'abc123';
        const findByIdAndDelete = jest.fn(() => Promise.resolve(true));
        const friendRequestModel = {
            findByIdAndDelete,
        };
        const request: any = { params: { friendRequestId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getDeleteFriendRequestMiddleware(friendRequestModel as any);

        await middleware(request, response, next);

        expect(findByIdAndDelete).toBeCalledWith(friendRequestId);
        expect(response.locals.deletedFriendRequest).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('throws NoFriendRequestToDeleteFound error when no solo streak is found', async () => {
        expect.assertions(1);
        const friendRequestId = 'abc123';
        const findByIdAndDelete = jest.fn(() => Promise.resolve(false));
        const friendRequestModel = {
            findByIdAndDelete,
        };
        const request: any = { params: { friendRequestId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getDeleteFriendRequestMiddleware(friendRequestModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.NoFriendRequestToDeleteFound));
    });

    test('calls next with DeleteFriendRequestMiddleware error on failure', async () => {
        expect.assertions(1);
        const friendRequestId = 'abc123';
        const error = 'error';
        const findByIdAndDelete = jest.fn(() => Promise.reject(error));
        const friendRequestModel = {
            findByIdAndDelete,
        };
        const request: any = { params: { friendRequestId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getDeleteFriendRequestMiddleware(friendRequestModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.DeleteFriendRequestMiddleware, expect.any(Error)));
    });
});

describe('sendFriendRequestDeletedResponseMiddleware', () => {
    test('responds with successful deletion', () => {
        expect.assertions(2);
        const successfulDeletionResponseCode = 204;
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {};
        const response: any = { status };
        const next = jest.fn();
        const middleware = getSendFriendRequestDeletedResponseMiddleware(successfulDeletionResponseCode);

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
        const middleware = getSendFriendRequestDeletedResponseMiddleware(successfulDeletionResponseCode);

        middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.SendFriendRequestDeletedResponseMiddleware, expect.any(Error)),
        );
    });
});

describe('deleteFriendRequestMiddlewares', () => {
    test('that deleteFriendRequestMiddlewares are defined in the correct order', () => {
        expect.assertions(4);

        expect(deleteFriendRequestMiddlewares.length).toEqual(3);
        expect(deleteFriendRequestMiddlewares[0]).toEqual(friendRequestParamsValidationMiddleware);
        expect(deleteFriendRequestMiddlewares[1]).toEqual(deleteFriendRequestMiddleware);
        expect(deleteFriendRequestMiddlewares[2]).toEqual(sendFriendRequestDeletedResponseMiddleware);
    });
});
