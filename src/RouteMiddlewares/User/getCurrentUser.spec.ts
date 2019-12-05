/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    sendCurrentUserMiddleware,
    getCurrentUserMiddlewares,
    formatUserMiddleware,
    populateUserBadgesMiddleware,
    getPopulateUserBadgesMiddleware,
} from './getCurrentUser';
import { CustomError } from '../../customError';
import { ErrorType } from '../../customError';
import { User } from '@streakoid/streakoid-sdk/lib';
import UserTypes from '@streakoid/streakoid-sdk/lib/userTypes';

describe('populateUserBadgesMiddleware', () => {
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

        const middleware = getPopulateUserBadgesMiddleware(badgeModel as any);
        await middleware(request, response, next);

        expect(find).toBeCalledWith({ _id: user.badges });
        expect(lean).toBeCalled();
        expect(next).toBeCalled();
    });

    test('calls next with PopulateUserBadgesMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const response: any = {};
        const request: any = {};
        const next = jest.fn();

        const middleware = getPopulateUserBadgesMiddleware({} as any);
        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.PopulateUserBadgesMiddleware, expect.any(Error)));
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
            friends: [],
            profileImages: {
                originalImageUrl: 'https://streakoid-profile-pictures.s3-eu-west-1.amazonaws.com/steve.jpg',
            },
            pushNotificationToken: 'pushNotifcationToken',
            notifications: {
                completeStreaksReminder: {
                    emailNotification: false,
                    pushNotification: false,
                    reminderTime: 21,
                },
                friendRequest: {
                    emailNotification: false,
                    pushNotification: false,
                },
                teamStreakUpdates: {
                    emailNotification: false,
                    pushNotification: false,
                },
                badgeUpdates: {
                    emailNotification: false,
                    pushNotification: false,
                },
            },
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
                'timezone',
                'createdAt',
                'updatedAt',
                'pushNotificationToken',
                'notifications',
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
        expect.assertions(4);

        expect(getCurrentUserMiddlewares.length).toEqual(3);
        expect(getCurrentUserMiddlewares[0]).toEqual(populateUserBadgesMiddleware);
        expect(getCurrentUserMiddlewares[1]).toEqual(formatUserMiddleware);
        expect(getCurrentUserMiddlewares[2]).toEqual(sendCurrentUserMiddleware);
    });
});
