/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import {
    userRequestBodyValidationMiddleware,
    getPatchCurrentUserMiddleware,
    patchCurrentUserMiddlewares,
    patchCurrentUserMiddleware,
    formatUserMiddleware,
    sendUpdatedCurrentUserMiddleware,
    populateUserBadgesMiddleware,
    getPopulateUserBadgesMiddleware,
} from './patchCurrentUserMiddlewares';

import { User } from '@streakoid/streakoid-sdk/lib';
import UserTypes from '@streakoid/streakoid-sdk/lib/userTypes';

describe('userRequestBodyValidationMiddleware', () => {
    test('allows request with all possible params to pass', () => {
        expect.assertions(1);

        const body = {
            email: 'email@gmail.com',
            notifications: {
                completeStreaksReminder: {
                    emailNotification: true,
                    pushNotification: true,
                    reminderTime: 18,
                },
                friendRequest: {
                    emailNotification: true,
                    pushNotification: true,
                },
                teamStreakUpdates: {
                    emailNotification: true,
                    pushNotification: true,
                },
                badgeUpdates: {
                    emailNotification: true,
                    pushNotification: true,
                },
            },
            timezone: 'Europe/London',
            pushNotificationToken: 'push-token',
        };
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body,
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        userRequestBodyValidationMiddleware(request, response, next);

        expect(next).toBeCalled();
    });
    test('sends correct error response when unsupported key is sent', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { unsupportedKey: 'unsupportedKey' },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        userRequestBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.badRequest);
        expect(send).toBeCalledWith({
            message: '"unsupportedKey" is not allowed',
        });
        expect(next).not.toBeCalled();
    });

    test('sends correct response is sent when timezone is not a string', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { timezone: 1234 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        userRequestBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "timezone" fails because ["timezone" must be a string]',
        });
        expect(next).not.toBeCalled();
    });
});

describe('patchCurrentUserMiddleware', () => {
    test('sets response.locals.updatedUser', async () => {
        expect.assertions(3);
        const user = {
            _id: '_id',
        };
        const timezone = 'Europe/London';
        const request: any = {
            body: {
                timezone,
            },
        };
        const response: any = { locals: { user } };
        const next = jest.fn();
        const lean = jest.fn().mockResolvedValue(true);
        const findByIdAndUpdate = jest.fn(() => ({ lean }));
        const userModel = {
            findByIdAndUpdate,
        };
        const middleware = getPatchCurrentUserMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(findByIdAndUpdate).toBeCalledWith(user._id, { timezone }, { new: true });
        expect(response.locals.updatedUser).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('throws UpdatedCurrentUserNotFound error when user is not found', async () => {
        expect.assertions(1);
        const user = {
            _id: '_id',
        };
        const request: any = {
            body: {
                timezone: 'Europe/London',
            },
        };
        const response: any = { locals: { user } };
        const next = jest.fn();
        const lean = jest.fn().mockResolvedValue(false);
        const findByIdAndUpdate = jest.fn(() => ({ lean }));
        const userModel = {
            findByIdAndUpdate,
        };
        const middleware = getPatchCurrentUserMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.UpdateCurrentUserNotFound));
    });

    test('calls next with PatchCurrentUserMiddleware on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();

        const middleware = getPatchCurrentUserMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.PatchCurrentUserMiddleware));
    });
});

describe('populateUserBadgesMiddleware', () => {
    test('populates user badges', async () => {
        expect.assertions(3);
        const request: any = {};
        const updatedUser = {
            badges: ['badgeId'],
        };
        const response: any = { locals: { updatedUser } };
        const next = jest.fn();

        const lean = jest.fn().mockResolvedValue(updatedUser.badges);
        const find = jest.fn(() => ({ lean }));

        const badgeModel = {
            find,
        };

        const middleware = getPopulateUserBadgesMiddleware(badgeModel as any);
        await middleware(request, response, next);

        expect(find).toBeCalledWith({ _id: updatedUser.badges });
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

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.PatchCurrentUserPopulateUserBadgesMiddleware, expect.any(Error)),
        );
    });
});

describe('formatUserMiddleware', () => {
    test('populates response.locals.user with a formattedUser', () => {
        expect.assertions(2);
        const request: any = {};
        const updatedUser: User = {
            _id: '_id',
            username: 'username',
            badges: [],
            membershipInformation: {
                isPayingMember: true,
                currentMembershipStartDate: new Date(),
                pastMemberships: [],
            },
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
            hasCompletedIntroduction: false,
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
        const response: any = { locals: { updatedUser } };
        const next = jest.fn();

        formatUserMiddleware(request, response, next);

        expect(next).toBeCalled();
        expect(Object.keys(response.locals.formattedUser).sort()).toEqual(
            [
                '_id',
                'email',
                'username',
                'badges',
                'membershipInformation',
                'userType',
                'followers',
                'following',
                'friends',
                'timezone',
                'createdAt',
                'updatedAt',
                'pushNotificationToken',
                'hasCompletedIntroduction',
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

describe('sendUpdatedCurrentUserMiddleware', () => {
    test('sends formattedUser', () => {
        expect.assertions(3);
        const updatedTimezone = 'Europe/Paris';
        const formattedUser = {
            userId: 'abc',
            timezone: updatedTimezone,
        };
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const userResponseLocals = { formattedUser };
        const response: any = { locals: userResponseLocals, status };
        const request: any = {};
        const next = jest.fn();

        sendUpdatedCurrentUserMiddleware(request, response, next);

        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(ResponseCodes.success);
        expect(send).toBeCalledWith(formattedUser);
    });

    test('calls next with SendUpdatedCurrentUserMiddleware error on middleware failure', () => {
        expect.assertions(1);

        const response: any = {};
        const request: any = {};
        const next = jest.fn();

        sendUpdatedCurrentUserMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendUpdatedCurrentUserMiddleware, expect.any(Error)));
    });
});

describe('patchUserMiddlewares', () => {
    test('are defined in the correct order', () => {
        expect.assertions(6);

        expect(patchCurrentUserMiddlewares.length).toBe(5);
        expect(patchCurrentUserMiddlewares[0]).toBe(userRequestBodyValidationMiddleware);
        expect(patchCurrentUserMiddlewares[1]).toBe(patchCurrentUserMiddleware);
        expect(patchCurrentUserMiddlewares[2]).toBe(populateUserBadgesMiddleware);
        expect(patchCurrentUserMiddlewares[3]).toBe(formatUserMiddleware);
        expect(patchCurrentUserMiddlewares[4]).toBe(sendUpdatedCurrentUserMiddleware);
    });
});
