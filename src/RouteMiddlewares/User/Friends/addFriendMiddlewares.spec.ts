/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    addFriendMiddlewares,
    addFriendParamsValidationMiddleware,
    getRetreiveUserMiddleware,
    retreiveUserMiddleware,
    addFriendBodyValidationMiddleware,
    getRetreiveFriendMiddleware,
    addFriendToUsersFriendListMiddleware,
    sendUserWithNewFriendMiddleware,
    isAlreadyAFriendMiddleware,
    getAddFriendToUsersFriendListMiddleware,
    retreiveFriendMiddleware,
    retreiveFriendRequestMiddleware,
    updateFriendRequestStatusMiddleware,
    getRetreiveFriendRequestMiddleware,
    getUpdateFriendRequestStatusMiddleware,
    addUserToFriendsFriendListMiddleware,
    getAddUserToFriendsFriendListMiddleware,
} from './addFriendMiddlewares';
import { CustomError, ErrorType } from '../../../customError';
import { FriendRequestStatus } from '@streakoid/streakoid-sdk/lib';

describe('addFriendMiddlewares', () => {
    describe('addFriendParamsValidationMiddleware', () => {
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

            addFriendParamsValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(422);
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

            addFriendParamsValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(422);
            expect(send).toBeCalledWith({
                message: 'child "userId" fails because ["userId" must be a string]',
            });
            expect(next).not.toBeCalled();
        });

        test('sends userId is not 24 characters long error', () => {
            expect.assertions(3);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {
                params: { userId: '12345678' },
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            addFriendParamsValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(422);
            expect(send).toBeCalledWith({
                message: 'child "userId" fails because ["userId" length must be 24 characters long]',
            });
            expect(next).not.toBeCalled();
        });
    });

    describe('addFriendBodyValidationMiddleware', () => {
        test('sends friendId is not defined error', () => {
            expect.assertions(3);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {
                body: {},
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            addFriendBodyValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(422);
            expect(send).toBeCalledWith({
                message: 'child "friendId" fails because ["friendId" is required]',
            });
            expect(next).not.toBeCalled();
        });

        test('sends friendId is not a string error', () => {
            expect.assertions(3);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {
                body: { friendId: 123 },
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            addFriendBodyValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(422);
            expect(send).toBeCalledWith({
                message: 'child "friendId" fails because ["friendId" must be a string]',
            });
            expect(next).not.toBeCalled();
        });

        test('sends friendId is not 24 characters long error', () => {
            expect.assertions(3);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {
                body: { friendId: '12345678' },
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            addFriendBodyValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(422);
            expect(send).toBeCalledWith({
                message: 'child "friendId" fails because ["friendId" length must be 24 characters long]',
            });
            expect(next).not.toBeCalled();
        });
    });

    describe('retreiveUserMiddleware', () => {
        test('sets response.locals.user and calls next()', async () => {
            expect.assertions(4);
            const lean = jest.fn(() => true);
            const findOne = jest.fn(() => ({ lean }));
            const userModel = { findOne };
            const userId = 'abcdefg';
            const request: any = { params: { userId } };
            const response: any = { locals: {} };
            const next = jest.fn();
            const middleware = getRetreiveUserMiddleware(userModel as any);

            await middleware(request, response, next);

            expect(response.locals.user).toBeDefined();
            expect(findOne).toBeCalledWith({ _id: userId });
            expect(lean).toBeCalledWith();
            expect(next).toBeCalledWith();
        });

        test('throws AddFriendUserDoesNotExist when user does not exist', async () => {
            expect.assertions(1);
            const userId = 'abcd';
            const lean = jest.fn(() => false);
            const findOne = jest.fn(() => ({ lean }));
            const userModel = { findOne };
            const request: any = { params: { userId } };
            const response: any = { locals: {} };
            const next = jest.fn();
            const middleware = getRetreiveUserMiddleware(userModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.AddFriendUserDoesNotExist));
        });

        test('throws AddFriendRetreiveUserMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const userId = 'abcd';
            const findOne = jest.fn(() => ({}));
            const userModel = { findOne };
            const request: any = { params: { userId } };
            const response: any = { status, locals: {} };
            const next = jest.fn();
            const middleware = getRetreiveUserMiddleware(userModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.AddFriendRetreiveUserMiddleware, expect.any(Error)));
        });
    });

    describe('isAlreadyAFriendMiddleware', () => {
        test('calls next if friend does not exist on users friend list', () => {
            expect.assertions(1);

            const friendId = 'friendId';
            const friend1 = {
                friendId: 'friend1',
                username: 'friend1',
            };
            const friend2 = {
                friendId: 'friend2',
                username: 'friend2',
            };
            const friends = [friend1, friend2];
            const user = {
                friends,
            };

            const request: any = { body: { friendId } };
            const response: any = { locals: { user } };
            const next = jest.fn();

            isAlreadyAFriendMiddleware(request, response, next);

            expect(next).toBeCalledWith();
        });

        test('throws IsAlreadyAFriend error if friend already exists on users friend list', () => {
            expect.assertions(1);

            const friendId = 'friend1';
            const friend1 = {
                friendId,
                username: 'friend',
            };
            const friends = [friend1];
            const user = {
                friends,
            };

            const request: any = { body: { friendId } };
            const response: any = { locals: { user } };
            const next = jest.fn();

            isAlreadyAFriendMiddleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.IsAlreadyAFriend));
        });

        test('throws IsAlreadyAFriendMiddleware error on middleware failure', () => {
            expect.assertions(1);

            const request: any = {};
            const response: any = {};
            const next = jest.fn();

            isAlreadyAFriendMiddleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.IsAlreadyAFriendMiddleware, expect.any(Error)));
        });
    });

    describe('retreiveFriendMiddleware', () => {
        test('sets response.locals.friend and calls next()', async () => {
            expect.assertions(4);
            const lean = jest.fn(() => true);
            const findOne = jest.fn(() => ({ lean }));
            const userModel = { findOne };
            const friendId = 'abcdefg';
            const request: any = { body: { friendId } };
            const response: any = { locals: {} };
            const next = jest.fn();
            const middleware = getRetreiveFriendMiddleware(userModel as any);

            await middleware(request, response, next);

            expect(response.locals.friend).toBeDefined();
            expect(findOne).toBeCalledWith({ _id: friendId });
            expect(lean).toBeCalledWith();
            expect(next).toBeCalledWith();
        });

        test('throws FriendDoesNotExist error when friend does not exist', async () => {
            expect.assertions(1);
            const friendId = 'abcd';
            const lean = jest.fn(() => false);
            const findOne = jest.fn(() => ({ lean }));
            const userModel = { findOne };
            const request: any = { body: { friendId } };
            const response: any = { locals: {} };
            const next = jest.fn();
            const middleware = getRetreiveFriendMiddleware(userModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.FriendDoesNotExist));
        });

        test('throws DoesFriendExistMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const friendId = 'abcd';
            const findOne = jest.fn(() => ({}));
            const userModel = { findOne };
            const request: any = { friendId: { friendId } };
            const response: any = { status, locals: {} };
            const next = jest.fn();
            const middleware = getRetreiveFriendMiddleware(userModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.DoesFriendExistMiddleware, expect.any(Error)));
        });
    });

    describe('retreiveFriendRequestMiddleware', () => {
        test('sets response.locals.friendrequest and calls next()', async () => {
            expect.assertions(4);
            const lean = jest.fn(() => true);
            const findOne = jest.fn(() => ({ lean }));
            const friendRequestModel = { findOne };
            const userId = '1234';
            const friendId = 'abcdefg';
            const request: any = { params: { userId }, body: { friendId } };
            const response: any = { locals: {} };
            const next = jest.fn();
            const middleware = getRetreiveFriendRequestMiddleware(friendRequestModel as any);

            await middleware(request, response, next);

            expect(response.locals.friendRequest).toBeDefined();
            expect(findOne).toBeCalledWith({
                requesteeId: userId,
                requesterId: friendId,
                status: FriendRequestStatus.pending,
            });
            expect(lean).toBeCalledWith();
            expect(next).toBeCalledWith();
        });

        test('throws FriendRequestDoesNotExist error when friend request does not exist', async () => {
            expect.assertions(1);
            const userId = '1234';
            const friendId = 'abcd';
            const lean = jest.fn(() => false);
            const findOne = jest.fn(() => ({ lean }));
            const friendRequestModel = { findOne };
            const request: any = { params: { userId }, body: { friendId } };
            const response: any = { locals: {} };
            const next = jest.fn();
            const middleware = getRetreiveFriendMiddleware(friendRequestModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.FriendDoesNotExist));
        });

        test('throws RetreiveFriendRequestMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const userModel = {};
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getRetreiveFriendRequestMiddleware(userModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.RetreiveFriendRequestMiddleware, expect.any(Error)));
        });
    });

    describe('addFriendToUsersFriendListMiddleware', () => {
        test('adds friendId to users friends list and sets response.locals.userWithNewFriend', async () => {
            expect.assertions(3);

            const userId = 'userId';
            const friendId = 'friendId';
            const username = 'username';
            const friend = {
                _id: friendId,
                username,
                otherKey: 'otherKey',
            };
            const findByIdAndUpdate = jest.fn().mockResolvedValue({ friends: [friend] });
            const userModel: any = { findByIdAndUpdate };
            const request: any = { params: { userId } };
            const response: any = { locals: { friend } };
            const next = jest.fn();

            const middleware = getAddFriendToUsersFriendListMiddleware(userModel);
            await middleware(request, response, next);

            expect(findByIdAndUpdate).toBeCalledWith(
                userId,
                {
                    $addToSet: { friends: { friendId, username } },
                },
                { new: true },
            );
            expect(response.locals.updatedFriends).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('throws AddFriendToUsersFriendListMiddleware error on middleware failure', async () => {
            expect.assertions(1);

            const request: any = {};
            const response: any = {};
            const next = jest.fn();

            const middleware = getAddFriendToUsersFriendListMiddleware({} as any);
            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.AddFriendToUsersFriendListMiddleware, expect.any(Error)),
            );
        });
    });

    describe('addUserToFriendsFriendListMiddleware', () => {
        test('adds user to friends friends list', async () => {
            expect.assertions(2);

            const userId = 'userId';
            const username = 'username';
            const user = {
                _id: userId,
                username,
            };
            const friendId = 'friendId';
            const friend = {
                _id: friendId,
            };
            const findByIdAndUpdate = jest.fn().mockResolvedValue({ friends: [friend] });
            const userModel: any = { findByIdAndUpdate };
            const request: any = { params: { userId } };
            const response: any = { locals: { user, friend } };
            const next = jest.fn();

            const middleware = getAddUserToFriendsFriendListMiddleware(userModel);
            await middleware(request, response, next);

            expect(findByIdAndUpdate).toBeCalledWith(
                friend._id,
                {
                    $addToSet: { friends: { friendId: user._id, username } },
                },
                { new: true },
            );
            expect(next).toBeCalledWith();
        });

        test('throws AddUserFriendsFriendListMiddleware error on middleware failure', async () => {
            expect.assertions(1);

            const request: any = {};
            const response: any = {};
            const next = jest.fn();

            const middleware = getAddFriendToUsersFriendListMiddleware({} as any);
            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.AddUserToFriendsFriendListMiddleware, expect.any(Error)),
            );
        });
    });

    describe('getUpdateFriendRequestStatusMiddleware', () => {
        test('updates friend request status to accepted and sets response.locals.updatedFriendRequest', async () => {
            expect.assertions(3);

            const _id = 'id';
            const friendRequest = {
                _id,
            };
            const findByIdAndUpdate = jest.fn().mockResolvedValue(true);
            const friendRequestModel: any = { findByIdAndUpdate };
            const request: any = {};
            const response: any = { locals: { friendRequest } };
            const next = jest.fn();

            const middleware = getUpdateFriendRequestStatusMiddleware(friendRequestModel);
            await middleware(request, response, next);

            expect(findByIdAndUpdate).toBeCalledWith(
                friendRequest._id,
                {
                    $set: { status: FriendRequestStatus.accepted },
                },
                { new: true },
            );
            expect(response.locals.updatedFriendRequest).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('throws UpdateFriendRequestStatusMiddleware error on middleware failure', async () => {
            expect.assertions(1);

            const request: any = {};
            const response: any = {};
            const next = jest.fn();

            const middleware = getUpdateFriendRequestStatusMiddleware({} as any);
            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.UpdateFriendRequestStatusMiddleware, expect.any(Error)),
            );
        });
    });

    describe('sendUserWithNewFriendMiddleware', () => {
        test('sends updated friends list', () => {
            expect.assertions(3);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const updatedFriends = [{ friendId: 'friendId', username: 'username' }];
            const request: any = {};
            const response: any = { locals: { updatedFriends }, status };
            const next = jest.fn();

            sendUserWithNewFriendMiddleware(request, response, next);

            expect(next).not.toBeCalled();
            expect(status).toBeCalledWith(201);
            expect(send).toBeCalledWith(updatedFriends);
        });

        test('calls next with SendUserWithNewFriendMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();

            await sendUserWithNewFriendMiddleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.SendUserWithNewFriendMiddleware, expect.any(Error)));
        });
    });

    test('are in the correct order', () => {
        expect.assertions(11);

        expect(addFriendMiddlewares.length).toEqual(10);
        expect(addFriendMiddlewares[0]).toEqual(addFriendParamsValidationMiddleware);
        expect(addFriendMiddlewares[1]).toEqual(addFriendBodyValidationMiddleware);
        expect(addFriendMiddlewares[2]).toEqual(retreiveUserMiddleware);
        expect(addFriendMiddlewares[3]).toEqual(isAlreadyAFriendMiddleware);
        expect(addFriendMiddlewares[4]).toEqual(retreiveFriendMiddleware);
        expect(addFriendMiddlewares[5]).toEqual(retreiveFriendRequestMiddleware);
        expect(addFriendMiddlewares[6]).toEqual(addFriendToUsersFriendListMiddleware);
        expect(addFriendMiddlewares[7]).toEqual(addUserToFriendsFriendListMiddleware);
        expect(addFriendMiddlewares[8]).toEqual(updateFriendRequestStatusMiddleware);
        expect(addFriendMiddlewares[9]).toEqual(sendUserWithNewFriendMiddleware);
    });
});
