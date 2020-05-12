/* eslint-disable @typescript-eslint/no-explicit-any */

import AchievementTypes from '@streakoid/streakoid-models/lib/Types/AchievementTypes';

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
    createPlatformEndpointMiddleware,
    updateUserPushNotificationInformationMiddleware,
    getCreatePlatformEndpointMiddleware,
    getUpdateUserPushNotificationInformationMiddleware,
} from './patchCurrentUserMiddlewares';

import { populateCurrentUserAchievementsMiddleware } from './getCurrentUser';
import { UserAchievement } from '@streakoid/streakoid-models/lib/Models/UserAchievement';
import UserTypes from '@streakoid/streakoid-models/lib/Types/UserTypes';
import { User } from '@streakoid/streakoid-models/lib/Models/User';
import StreakReminderTypes from '@streakoid/streakoid-models/lib/Types/StreakReminderTypes';
import { getServiceConfig } from '../../../src/getServiceConfig';
import PushNotificationSupportedDeviceTypes from '@streakoid/streakoid-models/lib/Types/PushNotificationSupportedDeviceTypes';

describe('patchCurrentUserMiddlewares', () => {
    describe('patchCurrentUserRequestBodyValidationMiddleware', () => {
        const values: {
            email: string;
            timezone: string;
            pushNotificationToken: string;
            pushNotification: {
                pushNotificationToken: string;
                deviceType: string;
            };
            hasCompletedIntroduction: boolean;
        } = {
            email: 'email@gmail.com',
            timezone: 'Europe/London',
            pushNotificationToken: 'push-token',
            pushNotification: {
                pushNotificationToken: 'notificationToken',
                deviceType: PushNotificationSupportedDeviceTypes.android,
            },
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

        test('sends correct response is when pushNotification is sent without a pushNotificationToken', () => {
            expect.assertions(3);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {
                body: { pushNotification: { deviceType: PushNotificationSupportedDeviceTypes.android } },
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            patchCurrentUserRequestBodyValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
            expect(send).toBeCalledWith({
                message:
                    'child "pushNotification" fails because [child "pushNotificationToken" fails because ["pushNotificationToken" is required]]',
            });
            expect(next).not.toBeCalled();
        });

        test('sends correct response is when pushNotification is sent without a device type', () => {
            expect.assertions(3);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {
                body: { pushNotification: { pushNotificationToken: 'token' } },
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            patchCurrentUserRequestBodyValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
            expect(send).toBeCalledWith({
                message:
                    'child "pushNotification" fails because [child "deviceType" fails because ["deviceType" is required]]',
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

    describe('createPlatformEndpointMiddleware', () => {
        test('creates android platform endpoint when deviceType is android and user does not have an endpointArn defined.', async () => {
            expect.assertions(4);
            const promise = jest.fn().mockResolvedValue({ EndpointArn: true });
            const createPlatformEndpoint = jest.fn(() => ({ promise }));
            const sns = {
                createPlatformEndpoint,
            };
            const pushNotificationToken = 'pushNotificationToken';
            const deviceType = PushNotificationSupportedDeviceTypes.android;
            const pushNotification = {
                pushNotificationToken,
                deviceType,
            };
            const request: any = { body: { pushNotification } };
            const response: any = { locals: { updatedUser: { _id: '_id' } } };
            const next = jest.fn();
            const middleware = getCreatePlatformEndpointMiddleware(sns as any);

            await middleware(request, response, next);

            expect(createPlatformEndpoint).toBeCalledWith({
                Token: pushNotificationToken,
                PlatformApplicationArn: getServiceConfig().ANDROID_SNS_PLATFORM_APPLICATION_ARN,
                CustomUserData: response.locals.updatedUser._id,
            });
            expect(promise).toBeCalledWith();
            expect(response.locals.endpointArn).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('creates ios platform endpoint when deviceType is ios and user does not have an endpointArn defined.', async () => {
            expect.assertions(4);
            const promise = jest.fn().mockResolvedValue({ EndpointArn: true });
            const createPlatformEndpoint = jest.fn(() => ({ promise }));
            const sns = {
                createPlatformEndpoint,
            };
            const pushNotificationToken = 'pushNotificationToken';
            const deviceType = PushNotificationSupportedDeviceTypes.ios;
            const pushNotification = {
                pushNotificationToken,
                deviceType,
            };
            const request: any = { body: { pushNotification } };
            const response: any = { locals: { updatedUser: { _id: '_id' } } };
            const next = jest.fn();
            const middleware = getCreatePlatformEndpointMiddleware(sns as any);

            await middleware(request, response, next);

            expect(createPlatformEndpoint).toBeCalledWith({
                Token: pushNotificationToken,
                PlatformApplicationArn: getServiceConfig().IOS_SNS_PLATFORM_APPLICATION_ARN,
                CustomUserData: response.locals.updatedUser._id,
            });
            expect(promise).toBeCalledWith();
            expect(response.locals.endpointArn).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('throws UnsupportedDeviceType error when device is unsupported and user does not have an endpointArn defined.', async () => {
            expect.assertions(1);
            const promise = jest.fn().mockResolvedValue({ EndpointArn: true });
            const createPlatformEndpoint = jest.fn(() => ({ promise }));
            const sns = {
                createPlatformEndpoint,
            };
            const pushNotificationToken = 'pushNotificationToken';
            const deviceType = 'unsupported';
            const pushNotification = {
                pushNotificationToken,
                deviceType,
            };
            const request: any = { body: { pushNotification } };
            const response: any = { locals: { updatedUser: { _id: '_id' } } };
            const next = jest.fn();
            const middleware = getCreatePlatformEndpointMiddleware(sns as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.UnsupportedDeviceType));
        });

        test('throws CreatePlatformEndpointMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getCreatePlatformEndpointMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.CreatePlatformEndpointMiddleware, expect.any(Error)));
        });
    });

    describe('updateUserPushNotificationInformationMiddleware', () => {
        test('if response.locals.endpointArn is defined update the users endpointArn and pushNotificationToken', async () => {
            expect.assertions(3);
            const endpointArn = 'endpointArn';
            const pushNotification = {
                pushNotificationToken: 'pushNotificationToken',
            };
            const request: any = {
                body: {
                    pushNotification,
                },
            };
            const updatedUser = {
                _id: '_id',
            };
            const response: any = { locals: { updatedUser, endpointArn } };
            const next = jest.fn();
            const lean = jest.fn().mockResolvedValue(true);
            const findByIdAndUpdate = jest.fn(() => ({ lean }));
            const userModel = {
                findByIdAndUpdate,
            };
            const middleware = getUpdateUserPushNotificationInformationMiddleware(userModel as any);

            await middleware(request, response, next);

            expect(findByIdAndUpdate).toBeCalledWith(
                updatedUser._id,
                {
                    $set: {
                        endpointArn,
                        pushNotificationToken: pushNotification.pushNotificationToken,
                    },
                },
                { new: true },
            );
            expect(response.locals.updatedUser).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('calls next with UpdateUserPushNotificationInformationMiddleware on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();

            const middleware = getUpdateUserPushNotificationInformationMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.UpdateUserPushNotificationInformationMiddleware));
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
                totalStreakCompletes: 10,
                totalLiveStreaks: 0,
                followers: [],
                following: [],
                profileImages: {
                    originalImageUrl: 'https://streakoid-profile-pictures.s3-eu-west-1.amazonaws.com/steve.jpg',
                },
                pushNotificationToken: 'pushNotificationToken',
                endpointArn: 'endpointArn',
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
                    achievementUpdates: {
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
                    'totalStreakCompletes',
                    'totalLiveStreaks',
                    'timezone',
                    'createdAt',
                    'updatedAt',
                    'pushNotifications',
                    'pushNotificationToken',
                    'endpointArn',
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

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.GetCurrentUserFormatUserMiddleware, expect.any(Error)),
            );
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
    test('are defined in the correct order', () => {
        expect.assertions(10);

        expect(patchCurrentUserMiddlewares.length).toBe(9);
        expect(patchCurrentUserMiddlewares[0]).toBe(patchCurrentUserRequestBodyValidationMiddleware);
        expect(patchCurrentUserMiddlewares[1]).toBe(patchCurrentUserMiddleware);
        expect(patchCurrentUserMiddlewares[2]).toBe(createPlatformEndpointMiddleware);
        expect(patchCurrentUserMiddlewares[3]).toBe(updateUserPushNotificationInformationMiddleware);
        expect(patchCurrentUserMiddlewares[4]).toBe(populateCurrentUserFollowingMiddleware);
        expect(patchCurrentUserMiddlewares[5]).toBe(populateCurrentUserFollowersMiddleware);
        expect(patchCurrentUserMiddlewares[6]).toBe(populateCurrentUserAchievementsMiddleware);
        expect(patchCurrentUserMiddlewares[7]).toBe(formatUserMiddleware);
        expect(patchCurrentUserMiddlewares[8]).toBe(sendUpdatedCurrentUserMiddleware);
    });
});
