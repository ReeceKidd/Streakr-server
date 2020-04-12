/* eslint-disable @typescript-eslint/no-explicit-any */

import { CustomError, ErrorType } from '../../../customError';
import {
    followUserMiddlewares,
    followUserParamsValidationMiddleware,
    followUserBodyValidationMiddleware,
    retreiveSelectedUserMiddleware,
    isSelectedUserAlreadyFollowingUserMiddleware,
    retreiveUserToFollowMiddleware,
    addUserToFollowToSelectedUsersFollowingMiddleware,
    sendUserWithNewFollowingMiddleware,
    getAddSelectedUserToUserToFollowFollowersMiddleware,
    getAddUserToFollowToSelectedUsersFollowingMiddleware,
    getRetreiveUserToFollowMiddleware,
    getRetreiveSelectedUserMiddleware,
    addSelectedUserToUserToFollowsFollowersMiddleware,
    createFollowUserActivityFeedItemMiddleware,
    getCreateFollowUserActivityFeedItemMiddleware,
    getSendNewFollowerRequestNotificationMiddleware,
    sendNewFollowerRequestNotificationMiddleware,
} from './followUserMiddlewares';

describe('followUserMiddlewares', () => {
    describe('followUserParamsValidationMiddleware', () => {
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

            followUserParamsValidationMiddleware(request, response, next);

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

            followUserParamsValidationMiddleware(request, response, next);

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

            followUserParamsValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(422);
            expect(send).toBeCalledWith({
                message: 'child "userId" fails because ["userId" length must be 24 characters long]',
            });
            expect(next).not.toBeCalled();
        });
    });

    describe('followUserBodyValidationMiddleware', () => {
        test('sends userToFollowId is not defined error', () => {
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

            followUserBodyValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(422);
            expect(send).toBeCalledWith({
                message: 'child "userToFollowId" fails because ["userToFollowId" is required]',
            });
            expect(next).not.toBeCalled();
        });

        test('sends userToFollowId is not a string error', () => {
            expect.assertions(3);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {
                body: { userToFollowId: 123 },
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            followUserBodyValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(422);
            expect(send).toBeCalledWith({
                message: 'child "userToFollowId" fails because ["userToFollowId" must be a string]',
            });
            expect(next).not.toBeCalled();
        });

        test('sends userToFollowId is not 24 characters long error', () => {
            expect.assertions(3);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {
                body: { userToFollowId: '12345678' },
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            followUserBodyValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(422);
            expect(send).toBeCalledWith({
                message: 'child "userToFollowId" fails because ["userToFollowId" length must be 24 characters long]',
            });
            expect(next).not.toBeCalled();
        });
    });

    describe('retreiveSelectedUserMiddleware', () => {
        test('sets response.locals.user and calls next()', async () => {
            expect.assertions(4);
            const lean = jest.fn(() => true);
            const findOne = jest.fn(() => ({ lean }));
            const userModel = { findOne };
            const userId = 'abcdefg';
            const request: any = { params: { userId } };
            const response: any = { locals: {} };
            const next = jest.fn();
            const middleware = getRetreiveSelectedUserMiddleware(userModel as any);

            await middleware(request, response, next);

            expect(response.locals.user).toBeDefined();
            expect(findOne).toBeCalledWith({ _id: userId });
            expect(lean).toBeCalledWith();
            expect(next).toBeCalledWith();
        });

        test('throws SelectedUserDoesNotExist when user does not exist', async () => {
            expect.assertions(1);
            const userId = 'abcd';
            const lean = jest.fn(() => false);
            const findOne = jest.fn(() => ({ lean }));
            const userModel = { findOne };
            const request: any = { params: { userId } };
            const response: any = { locals: {} };
            const next = jest.fn();
            const middleware = getRetreiveSelectedUserMiddleware(userModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.SelectedUserDoesNotExist));
        });

        test('throws RetreiveSelectedUserMiddleware error on middleware failure', async () => {
            expect.assertions(1);

            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getRetreiveSelectedUserMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.RetreiveSelectedUserMiddleware, expect.any(Error)));
        });
    });

    describe('isSelectedUserAlreadyFollowingUserMiddleware', () => {
        test('calls next if userToFollow does not exist on users following list', () => {
            expect.assertions(1);

            const userToFollowId = 'userToFollowId';
            const userToFollow2Id = 'userToFollow2Id';
            const following = [userToFollow2Id];
            const user = {
                following,
            };

            const request: any = { body: { userToFollowId } };
            const response: any = { locals: { user } };
            const next = jest.fn();

            isSelectedUserAlreadyFollowingUserMiddleware(request, response, next);

            expect(next).toBeCalledWith();
        });

        test('throws SelectedUserIsAlreadyFollowingUser error if userToFollow already exists on users following list', () => {
            expect.assertions(1);

            const userToFollowId = 'userToFollow1';
            const following = [userToFollowId];
            const user = {
                following,
            };

            const request: any = { body: { userToFollowId } };
            const response: any = { locals: { user } };
            const next = jest.fn();

            isSelectedUserAlreadyFollowingUserMiddleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.SelectedUserIsAlreadyFollowingUser));
        });

        test('throws IsSelectedUserIsAlreadFollowingUserMiddleware error on middleware failure', () => {
            expect.assertions(1);

            const request: any = {};
            const response: any = {};
            const next = jest.fn();

            isSelectedUserAlreadyFollowingUserMiddleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.IsSelectedUserIsAlreadFollowingUserMiddleware, expect.any(Error)),
            );
        });
    });

    describe('retreiveUserToFollowMiddleware', () => {
        test('sets response.locals.userToFollow and calls next()', async () => {
            expect.assertions(4);
            const lean = jest.fn(() => true);
            const findOne = jest.fn(() => ({ lean }));
            const userModel = { findOne };
            const userToFollowId = 'abcdefg';
            const request: any = { body: { userToFollowId } };
            const response: any = { locals: {} };
            const next = jest.fn();
            const middleware = getRetreiveUserToFollowMiddleware(userModel as any);

            await middleware(request, response, next);

            expect(response.locals.userToFollow).toBeDefined();
            expect(findOne).toBeCalledWith({ _id: userToFollowId });
            expect(lean).toBeCalledWith();
            expect(next).toBeCalledWith();
        });

        test('throws UserToFollowDoesNotExist error when user to follow does not exist', async () => {
            expect.assertions(1);
            const userToFollowId = 'abcd';
            const lean = jest.fn(() => false);
            const findOne = jest.fn(() => ({ lean }));
            const userModel = { findOne };
            const request: any = { body: { userToFollowId } };
            const response: any = { locals: {} };
            const next = jest.fn();
            const middleware = getRetreiveUserToFollowMiddleware(userModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.UserToFollowDoesNotExist));
        });

        test('throws RetreiveUserToFollowMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getRetreiveUserToFollowMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.RetreiveUserToFollowMiddleware, expect.any(Error)));
        });
    });

    describe('addUserToFollowToSelectedUsersFollowingMiddleware', () => {
        test('adds user to follow to selected users following and sets response.locals.following', async () => {
            expect.assertions(3);

            const userId = 'userId';
            const userToFollowId = 'userToFollowId';
            const findByIdAndUpdate = jest.fn().mockResolvedValue({ following: [userToFollowId] });
            const userModel: any = { findByIdAndUpdate };
            const request: any = { params: { userId }, body: { userToFollowId } };
            const response: any = { locals: {} };
            const next = jest.fn();

            const middleware = getAddUserToFollowToSelectedUsersFollowingMiddleware(userModel);
            await middleware(request, response, next);

            expect(findByIdAndUpdate).toBeCalledWith(
                userId,
                {
                    $addToSet: { following: userToFollowId },
                },
                { new: true },
            );
            expect(response.locals.following).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('throws AddUserToFollowToSelectedUsersFollowing error on middleware failure', async () => {
            expect.assertions(1);

            const request: any = {};
            const response: any = {};
            const next = jest.fn();

            const middleware = getAddUserToFollowToSelectedUsersFollowingMiddleware({} as any);
            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.AddUserToFollowToSelectedUsersFollowing, expect.any(Error)),
            );
        });
    });

    describe('addSelectedUserToUserToFollowFollowersMiddleware', () => {
        test('adds selected user to user to follow followers', async () => {
            expect.assertions(2);

            const userId = 'userId';
            const userToFollowId = 'userToFollowId';
            const findByIdAndUpdate = jest.fn().mockResolvedValue(true);
            const userModel: any = { findByIdAndUpdate };
            const request: any = { params: { userId }, body: { userToFollowId } };
            const response: any = { locals: {} };
            const next = jest.fn();

            const middleware = getAddSelectedUserToUserToFollowFollowersMiddleware(userModel);
            await middleware(request, response, next);

            expect(findByIdAndUpdate).toBeCalledWith(
                userToFollowId,
                {
                    $addToSet: { followers: userId },
                },
                { new: true },
            );
            expect(next).toBeCalledWith();
        });

        test('throws AddSelectedUserToUserToFollowFollowersMiddleware error on middleware failure', async () => {
            expect.assertions(1);

            const request: any = {};
            const response: any = {};
            const next = jest.fn();

            const middleware = getAddSelectedUserToUserToFollowFollowersMiddleware({} as any);
            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.AddSelectedUserToUserToFollowFollowersMiddleware, expect.any(Error)),
            );
        });
    });

    describe('sendUserWithNewFollowingMiddleware', () => {
        test('sends updated userToFollows list', () => {
            expect.assertions(3);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const following = ['userId'];
            const request: any = {};
            const response: any = { locals: { following }, status };
            const next = jest.fn();

            sendUserWithNewFollowingMiddleware(request, response, next);

            expect(next).toBeCalled();
            expect(status).toBeCalledWith(201);
            expect(send).toBeCalledWith(following);
        });

        test('calls next with SendUserWithNewFriendMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();

            await sendUserWithNewFollowingMiddleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.SendUserWithNewFollowingMiddleware, expect.any(Error)),
            );
        });
    });

    describe(`createFollowUserActivityFeedItemMiddleware`, () => {
        test('creates a new completedSoloStreakActivity', async () => {
            expect.assertions(2);
            const createActivityFeedItem = jest.fn().mockResolvedValue(true);

            const user = { _id: '_id', username: 'user' };
            const userToFollow = { _id: '_id', username: 'userToFollow' };

            const response: any = { locals: { user, userToFollow } };
            const request: any = {};
            const next = jest.fn();

            const middleware = getCreateFollowUserActivityFeedItemMiddleware(createActivityFeedItem as any);

            await middleware(request, response, next);

            expect(createActivityFeedItem).toBeCalled();
            expect(next).not.toBeCalled();
        });

        test('calls next with CreateFollowUserActivityFeedItemMiddleware error on middleware failure', () => {
            expect.assertions(1);

            const response: any = {};
            const request: any = {};
            const next = jest.fn();
            const middleware = getCreateFollowUserActivityFeedItemMiddleware({} as any);

            middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.CreateFollowUserActivityFeedItemMiddleware, expect.any(Error)),
            );
        });
    });

    describe(`sendNewFollowerRequestNotification`, () => {
        test('sends new follower request notification to userToFollow if user to follow has a pushNotificationToken and newFollowerUpdates.pushNotifcation enabled.', async () => {
            expect.assertions(2);

            const user = {
                username: 'user',
            };
            const userToFollow = {
                pushNotificationToken: 'pushNotificationToken',
                notifications: {
                    newFollowerUpdates: {
                        pushNotification: true,
                    },
                },
            };
            const sendPushNotificationsAsync = jest.fn().mockResolvedValue(true);
            const expo: any = { sendPushNotificationsAsync };
            const request: any = {};
            const response: any = {
                locals: {
                    user,
                    userToFollow,
                },
            };
            const next = jest.fn();

            const middleware = getSendNewFollowerRequestNotificationMiddleware(expo);
            await middleware(request, response, next);

            expect(sendPushNotificationsAsync).toBeCalledWith([
                {
                    to: userToFollow.pushNotificationToken,
                    sound: 'default',
                    title: 'New follower',
                    body: `${user.username} is following you.`,
                },
            ]);
            expect(next).toBeCalledWith();
        });

        test('does not send notification if pushNotificationToken is not defined', async () => {
            expect.assertions(2);

            const user = {
                username: 'user',
            };
            const userToFollow = {
                pushNotificationToken: null,
            };
            const sendPushNotificationsAsync = jest.fn().mockResolvedValue(true);
            const expo: any = { sendPushNotificationsAsync };
            const request: any = {};
            const response: any = {
                locals: {
                    user,
                    userToFollow,
                },
            };
            const next = jest.fn();

            const middleware = getSendNewFollowerRequestNotificationMiddleware(expo);
            await middleware(request, response, next);

            expect(sendPushNotificationsAsync).not.toBeCalled();
            expect(next).toBeCalledWith();
        });

        test('does not send notification if newFollowerUpdates.pushNotification is not enabled.', async () => {
            expect.assertions(2);

            const user = {
                username: 'user',
            };
            const userToFollow = {
                pushNotificationToken: 'pushNotificationToken',
                notifications: {
                    newFollowerUpdates: {
                        pushNotification: false,
                    },
                },
            };
            const sendPushNotificationsAsync = jest.fn().mockResolvedValue(true);
            const expo: any = { sendPushNotificationsAsync };
            const request: any = {};
            const response: any = {
                locals: {
                    user,
                    userToFollow,
                },
            };
            const next = jest.fn();

            const middleware = getSendNewFollowerRequestNotificationMiddleware(expo);
            await middleware(request, response, next);

            expect(sendPushNotificationsAsync).not.toBeCalled();
            expect(next).toBeCalledWith();
        });

        test('calls next with SendNewFollowerRequestNotification error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();

            const middleware = getSendNewFollowerRequestNotificationMiddleware({} as any);
            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.SendNewFollowerRequestNotificationMiddleware, expect.any(Error)),
            );
        });
    });

    test('are in the correct order', () => {
        expect.assertions(11);

        expect(followUserMiddlewares.length).toEqual(10);
        expect(followUserMiddlewares[0]).toEqual(followUserParamsValidationMiddleware);
        expect(followUserMiddlewares[1]).toEqual(followUserBodyValidationMiddleware);
        expect(followUserMiddlewares[2]).toEqual(retreiveSelectedUserMiddleware);
        expect(followUserMiddlewares[3]).toEqual(isSelectedUserAlreadyFollowingUserMiddleware);
        expect(followUserMiddlewares[4]).toEqual(retreiveUserToFollowMiddleware);
        expect(followUserMiddlewares[5]).toEqual(addUserToFollowToSelectedUsersFollowingMiddleware);
        expect(followUserMiddlewares[6]).toEqual(addSelectedUserToUserToFollowsFollowersMiddleware);
        expect(followUserMiddlewares[7]).toEqual(sendUserWithNewFollowingMiddleware);
        expect(followUserMiddlewares[8]).toEqual(createFollowUserActivityFeedItemMiddleware);
        expect(followUserMiddlewares[9]).toEqual(sendNewFollowerRequestNotificationMiddleware);
    });
});
