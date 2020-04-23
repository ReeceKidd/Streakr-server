/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import {
    getPatchCurrentUserMiddleware,
    patchCurrentUserMiddlewares,
    patchCurrentUserMiddleware,
    formatUserMiddleware,
    sendUpdatedCurrentUserMiddleware,
    populateCurrentUserFollowersMiddleware,
    populateCurrentUserFollowingMiddleware,
    getPopulateCurrentUserFollowingMiddleware,
    getPopulateCurrentUserFollowersMiddleware,
    patchCurrentUserRequestBodyValidationMiddleware,
    getPopulatePatchCurrentUserAchievementsMiddleware,
} from './patchCurrentUserMiddlewares';

import { User, StreakReminderTypes, AchievementTypes } from '@streakoid/streakoid-sdk/lib';
import UserTypes from '@streakoid/streakoid-sdk/lib/userTypes';
import { populateCurrentUserAchievementsMiddleware } from './getCurrentUser';
import UserAchievement from '@streakoid/streakoid-sdk/lib/models/UserAchievement';

describe('patchCurrentUserRequestBodyValidationMiddleware', () => {
    const values: {
        email: string;
        timezone: string;
        pushNotificationToken: string;
        hasCompletedIntroduction: boolean;
    } = {
        email: 'email@gmail.com',
        timezone: 'Europe/London',
        pushNotificationToken: 'push-token',
        hasCompletedIntroduction: true,
    };
    test('allows request with all possible params to pass', () => {
        expect.assertions(1);

        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: values,
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        patchCurrentUserRequestBodyValidationMiddleware(request, response, next);

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

        patchCurrentUserRequestBodyValidationMiddleware(request, response, next);

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

        patchCurrentUserRequestBodyValidationMiddleware(request, response, next);

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

describe('populateCurrentUserFollowingMiddleware', () => {
    test('populates updatedUser following', async () => {
        expect.assertions(3);
        const request: any = {};
        const updatedUser = {
            following: ['userId'],
        };
        const response: any = { locals: { updatedUser } };
        const next = jest.fn();

        const lean = jest.fn().mockResolvedValue([{ username: 'username' }]);
        const findById = jest.fn(() => ({ lean }));

        const userModel = {
            findById,
        };

        const middleware = getPopulateCurrentUserFollowingMiddleware(userModel as any);
        await middleware(request, response, next);

        expect(findById).toBeCalledWith(updatedUser.following[0]);
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
            new CustomError(ErrorType.PopulatePatchCurrentUserFollowingMiddleware, expect.any(Error)),
        );
    });
});

describe('populateCurrentUserFollowersMiddleware', () => {
    test('populates updatedUser following', async () => {
        expect.assertions(3);
        const request: any = {};
        const updatedUser = {
            followers: ['userId'],
        };
        const response: any = { locals: { updatedUser } };
        const next = jest.fn();

        const lean = jest.fn().mockResolvedValue([{ username: 'username' }]);
        const findById = jest.fn(() => ({ lean }));

        const userModel = {
            findById,
        };

        const middleware = getPopulateCurrentUserFollowersMiddleware(userModel as any);
        await middleware(request, response, next);

        expect(findById).toBeCalledWith(updatedUser.followers[0]);
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
            new CustomError(ErrorType.PopulatePatchCurrentUserFollowersMiddleware, expect.any(Error)),
        );
    });
});

describe('populatePatchCurrentUserAchievementsMiddleware', () => {
    test('populates user achievements', async () => {
        expect.assertions(3);
        const request: any = {};
        const userAchievement: UserAchievement = {
            _id: '_id',
            achievementType: AchievementTypes.oneHundredDaySoloStreak,
        };
        const user = {
            _id: 'userId',
            achievements: [userAchievement],
        };
        const response: any = { locals: { user } };
        const next = jest.fn();

        const lean = jest.fn().mockResolvedValue(true);
        const findById = jest.fn(() => ({ lean }));

        const achievementModel = {
            findById,
        };

        const middleware = getPopulatePatchCurrentUserAchievementsMiddleware(achievementModel as any);
        await middleware(request, response, next);

        expect(findById).toBeCalledWith(userAchievement._id);
        expect(lean).toBeCalled();
        expect(next).toBeCalled();
    });

    test('calls next with PopulatePatchCurrentUserAchievementsMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const response: any = {};
        const request: any = {};
        const next = jest.fn();

        const middleware = getPopulatePatchCurrentUserAchievementsMiddleware({} as any);
        await middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.PopulatePatchCurrentUserAchievementsMiddleware, expect.any(Error)),
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
            pushNotifications: {
                completeAllStreaksReminder: {
                    enabled: true,
                    expoId: 'expoId',
                    reminderHour: 10,
                    reminderMinute: 15,
                    streakReminderType: StreakReminderTypes.completeAllStreaksReminder,
                },
                teamStreakUpdates: {
                    enabled: true,
                },
                newFollowerUpdates: {
                    enabled: true,
                },
                customStreakReminders: [],
            },
            hasCompletedIntroduction: false,
            stripe: {
                customer: 'abc',
                subscription: 'sub_1',
            },
            achievements: [],
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
                'membershipInformation',
                'userType',
                'followers',
                'following',
                'friends',
                'timezone',
                'createdAt',
                'updatedAt',
                'pushNotifications',
                'pushNotificationToken',
                'hasCompletedIntroduction',
                'profileImages',
                'achievements',
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
        expect.assertions(8);

        expect(patchCurrentUserMiddlewares.length).toBe(7);
        expect(patchCurrentUserMiddlewares[0]).toBe(patchCurrentUserRequestBodyValidationMiddleware);
        expect(patchCurrentUserMiddlewares[1]).toBe(patchCurrentUserMiddleware);
        expect(patchCurrentUserMiddlewares[2]).toBe(populateCurrentUserFollowingMiddleware);
        expect(patchCurrentUserMiddlewares[3]).toBe(populateCurrentUserFollowersMiddleware);
        expect(patchCurrentUserMiddlewares[4]).toBe(populateCurrentUserAchievementsMiddleware);
        expect(patchCurrentUserMiddlewares[5]).toBe(formatUserMiddleware);
        expect(patchCurrentUserMiddlewares[6]).toBe(sendUpdatedCurrentUserMiddleware);
    });
});
