/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    sendCurrentUserMiddleware,
    getCurrentUserMiddlewares,
    formatUserMiddleware,
    populateCurrentUserBadgesMiddleware,
    getPopulateCurrentUserBadgesMiddleware,
    populateCurrentUserFollowingMiddleware,
    populateCurrentUserFollowersMiddleware,
    getPopulateCurrentUserFollowingMiddleware,
    getPopulateCurrentUserFollowersMiddleware,
} from './getCurrentUser';
import { CustomError } from '../../customError';
import { ErrorType } from '../../customError';
import { User, PushNotificationTypes } from '@streakoid/streakoid-sdk/lib';
import UserTypes from '@streakoid/streakoid-sdk/lib/userTypes';

describe('populateCurrentUserBadgesMiddleware', () => {
    test('populates user badges', async () => {
        expect.assertions(3);
        const request: any = {};
        const user = {
            badges: ['badgeId'],
        };
        const response: any = { locals: { user } };
        const next = jest.fn();

        const lean = jest.fn().mockResolvedValue(user.badges);
        const find = jest.fn(() => ({ lean }));

        const badgeModel = {
            find,
        };

        const middleware = getPopulateCurrentUserBadgesMiddleware(badgeModel as any);
        await middleware(request, response, next);

        expect(find).toBeCalledWith({ _id: user.badges });
        expect(lean).toBeCalled();
        expect(next).toBeCalled();
    });

    test('calls next with PopulateCurrentUserBadgesMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const response: any = {};
        const request: any = {};
        const next = jest.fn();

        const middleware = getPopulateCurrentUserBadgesMiddleware({} as any);
        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.PopulateCurrentUserBadgesMiddleware, expect.any(Error)));
    });
});

describe('populateCurrentUserFollowingMiddleware', () => {
    test('populates user following', async () => {
        expect.assertions(3);
        const request: any = {};
        const user = {
            following: ['userId'],
        };
        const response: any = { locals: { user } };
        const next = jest.fn();

        const lean = jest.fn().mockResolvedValue([{ username: 'username' }]);
        const findById = jest.fn(() => ({ lean }));

        const userModel = {
            findById,
        };

        const middleware = getPopulateCurrentUserFollowingMiddleware(userModel as any);
        await middleware(request, response, next);

        expect(findById).toBeCalledWith(user.following[0]);
        expect(lean).toBeCalled();
        expect(next).toBeCalled();
    });

    test('calls next with PopulateCurrentUserFollowingMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const response: any = {};
        const request: any = {};
        const next = jest.fn();

        const middleware = getPopulateCurrentUserFollowingMiddleware({} as any);
        await middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.PopulateCurrentUserFollowingMiddleware, expect.any(Error)),
        );
    });
});

describe('populateCurrentUserFollowersMiddleware', () => {
    test('populates user following', async () => {
        expect.assertions(3);
        const request: any = {};
        const user = {
            followers: ['userId'],
        };
        const response: any = { locals: { user } };
        const next = jest.fn();

        const lean = jest.fn().mockResolvedValue([{ username: 'username' }]);
        const findById = jest.fn(() => ({ lean }));

        const userModel = {
            findById,
        };

        const middleware = getPopulateCurrentUserFollowersMiddleware(userModel as any);
        await middleware(request, response, next);

        expect(findById).toBeCalledWith(user.followers[0]);
        expect(lean).toBeCalled();
        expect(next).toBeCalled();
    });

    test('calls next with PopulateCurrentUserFollowersMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const response: any = {};
        const request: any = {};
        const next = jest.fn();

        const middleware = getPopulateCurrentUserFollowingMiddleware({} as any);
        await middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.PopulateCurrentUserFollowersMiddleware, expect.any(Error)),
        );
    });
});

describe('formatUserMiddleware', () => {
    test('populates response.locals.user with a formattedUser', () => {
        expect.assertions(2);
        const request: any = {};
        const user: User = {
            _id: '_id',
            username: 'username',
            membershipInformation: {
                isPayingMember: true,
                currentMembershipStartDate: new Date(),
                pastMemberships: [],
            },
            badges: [],
            email: 'test@test.com',
            createdAt: 'Jan 1st',
            updatedAt: 'Jan 1st',
            timezone: 'Europe/London',
            userType: UserTypes.basic,
            followers: [],
            following: [],
            friends: [],
            profileImages: {
                originalImageUrl: 'https://streakoid-profile-pictures.s3-eu-west-1.amazonaws.com/steve.jpg',
            },
            pushNotificationToken: 'pushNotifcationToken',
            pushNotifications: {
                completeAllStreaksReminder: {
                    enabled: true,
                    expoId: 'expoId',
                    reminderMinute: 10,
                    reminderHour: 10,
                    type: PushNotificationTypes.completeAllStreaksReminder,
                },
                badgeUpdates: {
                    enabled: false,
                },
                teamStreakUpdates: {
                    enabled: true,
                },
                newFollowerUpdates: {
                    enabled: true,
                },
            },
            hasCompletedIntroduction: false,
            stripe: {
                customer: 'abc',
                subscription: 'sub_1',
            },
        };
        const response: any = { locals: { user } };
        const next = jest.fn();

        formatUserMiddleware(request, response, next);

        expect(next).toBeCalled();
        expect(Object.keys(response.locals.formattedUser).sort()).toEqual(
            [
                '_id',
                'email',
                'username',
                'membershipInformation',
                'userType',
                'badges',
                'followers',
                'following',
                'friends',
                'timezone',
                'createdAt',
                'updatedAt',
                'pushNotificationToken',
                'pushNotifications',
                'hasCompletedIntroduction',
                'profileImages',
            ].sort(),
        );
    });

    test('calls next with GetCurrentUserFormatUserMiddleware error on middleware failure', () => {
        expect.assertions(1);
        const response: any = {};
        const request: any = {};
        const next = jest.fn();

        formatUserMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.GetCurrentUserFormatUserMiddleware, expect.any(Error)));
    });
});

describe('sendCurrentUserMiddleware', () => {
    test('sends user', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const formattedUser = { _id: 'abc' };
        const request: any = {};
        const response: any = { locals: { formattedUser }, status };
        const next = jest.fn();

        sendCurrentUserMiddleware(request, response, next);

        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(200);
        expect(send).toBeCalledWith(formattedUser);
    });

    test('calls next with SendRetreiveUserResponseMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const error = 'error';
        const send = jest.fn(() => Promise.reject(error));
        const status = jest.fn(() => ({ send }));
        const response: any = { status };
        const next = jest.fn();

        await sendCurrentUserMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendUserMiddleware, expect.any(Error)));
    });
});

describe('getCurrentUserMiddlewares', () => {
    test('are defined in the correct order', () => {
        expect.assertions(6);

        expect(getCurrentUserMiddlewares.length).toEqual(5);
        expect(getCurrentUserMiddlewares[0]).toEqual(populateCurrentUserBadgesMiddleware);
        expect(getCurrentUserMiddlewares[1]).toEqual(populateCurrentUserFollowingMiddleware);
        expect(getCurrentUserMiddlewares[2]).toEqual(populateCurrentUserFollowersMiddleware);
        expect(getCurrentUserMiddlewares[3]).toEqual(formatUserMiddleware);
        expect(getCurrentUserMiddlewares[4]).toEqual(sendCurrentUserMiddleware);
    });
});
