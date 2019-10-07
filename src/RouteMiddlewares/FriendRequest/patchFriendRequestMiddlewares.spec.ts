/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    patchFriendRequestMiddlewares,
    friendRequestRequestBodyValidationMiddleware,
    getPatchFriendRequestMiddleware,
    patchFriendRequestMiddleware,
    sendUpdatedPopulatedFriendRequestMiddleware,
    friendRequestParamsValidationMiddleware,
    defineUpdatedPopulatedFriendRequestMiddleware,
    getRetreiveFormattedRequesterMiddleware,
    getRetreiveFormattedRequesteeMiddleware,
    retreiveFormattedRequesteeMiddleware,
    retreiveFormattedRequesterMiddleware,
} from './patchFriendRequestMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { FriendRequest, FriendRequestStatus } from '@streakoid/streakoid-sdk/lib';

describe('friendRequestParamsValidationMiddleware', () => {
    test('sends correct error response when friendRequestId is not defined', () => {
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

    test('sends correct error response when friendRequestId is not a string', () => {
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

describe('friendRequestRequestBodyValidationMiddleware', () => {
    test('sends correct error response when unsupported key is sent', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { unsupportedKey: 1234 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        friendRequestRequestBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.badRequest);
        expect(send).toBeCalledWith({
            message: '"unsupportedKey" is not allowed',
        });
        expect(next).not.toBeCalled();
    });
});

describe('patchFriendRequestMiddleware', () => {
    test('sets response.locals.updatedFriendRequest', async () => {
        expect.assertions(3);
        const friendRequestId = 'abc123';
        const userId = '123cde';
        const streakName = 'Daily programming';
        const streakDescription = 'Do one hour of programming each day';
        const status = 'archived';
        const request: any = {
            params: { friendRequestId },
            body: {
                userId,
                streakName,
                streakDescription,
                status,
            },
        };
        const response: any = { locals: {} };
        const next = jest.fn();
        const lean = jest.fn().mockResolvedValue(true);
        const findByIdAndUpdate = jest.fn(() => ({ lean }));
        const friendRequestModel = {
            findByIdAndUpdate,
        };
        const middleware = getPatchFriendRequestMiddleware(friendRequestModel as any);

        await middleware(request, response, next);

        expect(findByIdAndUpdate).toBeCalledWith(
            friendRequestId,
            { userId, streakName, streakDescription, status },
            { new: true },
        );
        expect(response.locals.updatedFriendRequest).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('throws UpdatedFriendRequestNotFound error when friend request is not found', async () => {
        expect.assertions(1);
        const friendRequestId = 'abc123';

        const request: any = {
            params: { friendRequestId },
            body: {},
        };
        const response: any = { locals: {} };
        const next = jest.fn();
        const lean = jest.fn().mockResolvedValue(false);
        const findByIdAndUpdate = jest.fn(() => ({ lean }));
        const friendRequestModel = {
            findByIdAndUpdate,
        };
        const middleware = getPatchFriendRequestMiddleware(friendRequestModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.UpdatedFriendRequestNotFound));
    });

    test('calls next with PatchFriendRequestMiddleware on middleware failure', async () => {
        expect.assertions(1);
        const friendRequestId = 'abc123';
        const userId = '123cde';
        const streakName = 'Daily programming';
        const streakDescription = 'Do one hour of programming each day';
        const request: any = {
            params: { friendRequestId },
            body: {
                userId,
                streakName,
                streakDescription,
            },
        };
        const response: any = { locals: {} };
        const next = jest.fn();
        const errorMessage = 'error';
        const findByIdAndUpdate = jest.fn(() => Promise.reject(errorMessage));
        const friendRequestModel = {
            findByIdAndUpdate,
        };
        const middleware = getPatchFriendRequestMiddleware(friendRequestModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.PatchFriendRequestMiddleware));
    });
});

describe('retreiveFormattedRequesterMiddleware', () => {
    test('sets response.locals.formattedRequester and calls next()', async () => {
        expect.assertions(4);
        const requesterId = 'requesterId';
        const updatedFriendRequest = {
            requesterId,
        };
        const _id = '_id';
        const username = 'username';
        const lean = jest.fn(() => ({
            _id,
            username,
        }));
        const findById = jest.fn(() => ({ lean }));
        const userModel = { findById };
        const request: any = {};
        const response: any = { locals: { updatedFriendRequest } };
        const next = jest.fn();
        const middleware = getRetreiveFormattedRequesterMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(response.locals.formattedRequester).toEqual({
            _id,
            username,
        });
        expect(findById).toBeCalledWith(requesterId);
        expect(lean).toBeCalledWith();
        expect(next).toBeCalledWith();
    });

    test('throws RetreiveFormattedRequesterDoesNotExist when user does not exist', async () => {
        expect.assertions(1);
        const requesterId = 'requesterId';
        const updatedFriendRequest = {
            requesterId,
        };
        const lean = jest.fn(() => false);
        const findById = jest.fn(() => ({ lean }));
        const userModel = { findById };
        const request: any = {};
        const response: any = { locals: { updatedFriendRequest } };
        const next = jest.fn();
        const middleware = getRetreiveFormattedRequesterMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.RetreiveFormattedRequesterDoesNotExist));
    });

    test('throws RetreiveFormattedRequesterMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        const middleware = getRetreiveFormattedRequesteeMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.RetreiveFormattedRequesteeMiddleware, expect.any(Error)));
    });
});

describe('retreiveFormattedRequesteeMiddleware', () => {
    test('sets response.locals.formattedRequestee and calls next()', async () => {
        expect.assertions(4);
        const requesteeId = 'requesterId';
        const updatedFriendRequest = {
            requesteeId,
        };
        const _id = '_id';
        const username = 'username';
        const lean = jest.fn(() => ({
            _id,
            username,
        }));
        const findById = jest.fn(() => ({ lean }));
        const userModel = { findById };
        const request: any = {};
        const response: any = { locals: { updatedFriendRequest } };
        const next = jest.fn();
        const middleware = getRetreiveFormattedRequesteeMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(response.locals.formattedRequestee).toEqual({
            _id,
            username,
        });
        expect(findById).toBeCalledWith(requesteeId);
        expect(lean).toBeCalledWith();
        expect(next).toBeCalledWith();
    });

    test('throws RetreiveFormattedRequesteeDoesNotExist when user does not exist', async () => {
        expect.assertions(1);
        const requesterId = 'requesterId';
        const updatedFriendRequest = {
            requesterId,
        };
        const lean = jest.fn(() => false);
        const findById = jest.fn(() => ({ lean }));
        const userModel = { findById };
        const request: any = {};
        const response: any = { locals: { updatedFriendRequest } };
        const next = jest.fn();
        const middleware = getRetreiveFormattedRequesteeMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.RetreiveFormattedRequesteeDoesNotExist));
    });

    test('throws RetreiveFormattedRequesteeMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        const middleware = getRetreiveFormattedRequesteeMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.RetreiveFormattedRequesteeMiddleware, expect.any(Error)));
    });
});

describe('defineUpdatedPopulatedFriendRequestMiddleware', () => {
    test('sets response.locals.updatedPopulatedFriendRequest and calls next', async () => {
        expect.assertions(5);
        const requesterId = 'requesterId';
        const formattedRequester = {
            _id: requesterId,
            username: 'requester',
        };
        const requesteeId = 'requesteeId';
        const formattedRequestee = {
            _id: requesteeId,
            username: 'requestee',
        };
        const _id = '_id';
        const status = FriendRequestStatus.pending;
        const createdAt = 'createdAt';
        const updatedAt = 'updatedAt';
        const updatedFriendRequest: FriendRequest = {
            _id,
            status,
            requesteeId,
            requesterId,
            createdAt,
            updatedAt,
        };
        const request: any = {};
        const response: any = { locals: { updatedFriendRequest, formattedRequester, formattedRequestee } };
        const next = jest.fn();
        defineUpdatedPopulatedFriendRequestMiddleware(request, response, next);

        expect(response.locals.updatedPopulatedFriendRequest).toBeDefined();
        const updatedPopulatedFriendRequest = response.locals.updatedPopulatedFriendRequest;
        expect(updatedPopulatedFriendRequest.requestee._id).toBeDefined();
        expect(updatedPopulatedFriendRequest.requestee.username).toBeDefined();
        expect(updatedPopulatedFriendRequest.requester._id).toBeDefined();
        expect(updatedPopulatedFriendRequest.requester.username).toBeDefined();
    });

    test('calls next with PopulateFriendRequestMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        defineUpdatedPopulatedFriendRequestMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.PopulateFriendRequestMiddleware, expect.any(Error)));
    });
});

describe('sendUpdatedPopulatedFriendRequestMiddleware', () => {
    test('sends updatedFriendRequest', () => {
        expect.assertions(4);
        const updatedPopulatedFriendRequest = {
            _id: '_id',
            requestee: {
                _id: '_id',
                username: 'requestee',
            },
            requester: {
                _id: '_id',
                username: 'requester',
            },
        };
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const friendRequestResponseLocals = { updatedPopulatedFriendRequest };
        const response: any = { locals: friendRequestResponseLocals, status };
        const request: any = {};
        const next = jest.fn();
        const updatedResourceResponseCode = 200;

        sendUpdatedPopulatedFriendRequestMiddleware(request, response, next);

        expect(response.locals.user).toBeUndefined();
        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(updatedResourceResponseCode);
        expect(send).toBeCalledWith(updatedPopulatedFriendRequest);
    });

    test('calls next with SendUpdatedFriendRequestMiddleware error on middleware failure', () => {
        expect.assertions(1);

        const response: any = {};
        const request: any = {};
        const next = jest.fn();

        sendUpdatedPopulatedFriendRequestMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendUpdatedFriendRequestMiddleware, expect.any(Error)));
    });
});

describe('patchFriendRequestMiddlewares', () => {
    test('are defined in the correct order', () => {
        expect.assertions(8);

        expect(patchFriendRequestMiddlewares.length).toBe(7);
        expect(patchFriendRequestMiddlewares[0]).toBe(friendRequestParamsValidationMiddleware);
        expect(patchFriendRequestMiddlewares[1]).toBe(friendRequestRequestBodyValidationMiddleware);
        expect(patchFriendRequestMiddlewares[2]).toBe(patchFriendRequestMiddleware);
        expect(patchFriendRequestMiddlewares[3]).toBe(retreiveFormattedRequesteeMiddleware);
        expect(patchFriendRequestMiddlewares[4]).toBe(retreiveFormattedRequesterMiddleware);
        expect(patchFriendRequestMiddlewares[5]).toBe(defineUpdatedPopulatedFriendRequestMiddleware);
        expect(patchFriendRequestMiddlewares[6]).toBe(sendUpdatedPopulatedFriendRequestMiddleware);
    });
});
