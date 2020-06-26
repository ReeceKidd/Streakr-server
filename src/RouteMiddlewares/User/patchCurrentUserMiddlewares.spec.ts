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
    doesUserEmailExistMiddleware,
    doesUsernameExistMiddleware,
    getDoesUserEmailExistMiddleware,
    getDoesUsernameExistMiddleware,
    getFormatUserMiddleware,
    removeOldAndroidEndpointArnWhenPushNotificationIsUpdatedMiddleware,
    removeOldIosEndpointArnWhenPushNotificationIsUpdatedMiddleware,
    createAndroidPlatformEndpointMiddleware,
    createIosPlatformEndpointMiddleware,
    getRemoveOldAndroidEndpointArnWhenPushNotificationIsUpdatedMiddleware,
    getRemoveOldIosEndpointArnWhenPushNotificationIsUpdatedMiddleware,
    getCreateAndroidPlatformEndpointMiddleware,
    getCreateIosPlatformEndpointMiddleware,
} from './patchCurrentUserMiddlewares';

import { populateCurrentUserAchievementsMiddleware } from './getCurrentUser';
import { UserAchievement } from '@streakoid/streakoid-models/lib/Models/UserAchievement';
import PushNotificationSupportedDeviceTypes from '@streakoid/streakoid-models/lib/Types/PushNotificationSupportedDeviceTypes';
import WhyDoYouWantToBuildNewHabitsTypes from '@streakoid/streakoid-models/lib/Types/WhyDoYouWantToBuildNewHabitsTypes';
import { Onboarding } from '@streakoid/streakoid-models/lib/Models/Onboarding';
import { getMockUser } from '../../testHelpers/getMockUser';
import { BasicUser } from '@streakoid/streakoid-models/lib/Models/BasicUser';
import { DatabaseAchievementType } from '@streakoid/streakoid-models/lib/Models/DatabaseAchievement';
import UserTypes from '@streakoid/streakoid-models/lib/Types/UserTypes';
import { getServiceConfig } from '../../getServiceConfig';

describe('patchCurrentUserMiddlewares', () => {
    describe('patchCurrentUserRequestBodyValidationMiddleware', () => {
        const values: {
            email: string;
            username: string;
            firstName: string;
            lastName: string;
            hasUsernameBeenCustomized: boolean;
            timezone: string;
            pushNotificationToken: string;
            pushNotification: {
                token: string;
                deviceType: string;
            };
            hasProfileImageBeenCustomized: boolean;
            hasCompletedIntroduction: boolean;
            hasCompletedTutorial: boolean;
            onboarding: Onboarding;
            hasCompletedOnboarding: boolean;
            userType: UserTypes.basic;
            hasVerifiedEmail: boolean;
            hasCustomPassword: boolean;
            teamStreaksOrder: string[];
        } = {
            email: 'email@gmail.com',
            username: 'username',
            firstName: 'Bob',
            lastName: 'Smith',
            hasUsernameBeenCustomized: true,
            timezone: 'Europe/London',
            pushNotificationToken: 'pushNotificationToken',
            pushNotification: {
                token: 'notificationToken',
                deviceType: PushNotificationSupportedDeviceTypes.android,
            },
            hasProfileImageBeenCustomized: true,
            hasCompletedIntroduction: true,
            hasCompletedTutorial: true,
            onboarding: {
                whyDoYouWantToBuildNewHabitsChoice: WhyDoYouWantToBuildNewHabitsTypes.education,
            },
            hasCompletedOnboarding: true,
            userType: UserTypes.basic,
            hasVerifiedEmail: true,
            hasCustomPassword: true,
            teamStreaksOrder: ['a1b2'],
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

        test('sends correct response when userType is not equal to basic', () => {
            expect.assertions(3);
            const send = jest.fn();
            const status = jest.fn(() => ({ send }));
            const request: any = {
                body: { userType: UserTypes.admin },
            };
            const response: any = {
                status,
            };
            const next = jest.fn();

            patchCurrentUserRequestBodyValidationMiddleware(request, response, next);

            expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
            expect(send).toBeCalledWith({
                message: 'child "userType" fails because ["userType" must be one of [basic]]',
            });
            expect(next).not.toBeCalled();
        });
    });

    describe(`doesUserEmailExistMiddleware`, () => {
        test('calls next() if EMAIL does not exist', async () => {
            expect.assertions(2);
            const email = 'person@gmail.com';
            const findOne = jest.fn(() => Promise.resolve(false));
            const UserModel = {
                findOne,
            };
            const request: any = { body: { email } };
            const response: any = { locals: {} };
            const next = jest.fn();
            const middleware = getDoesUserEmailExistMiddleware(UserModel as any);

            await middleware(request, response, next);

            expect(findOne).toBeCalledWith({ email });
            expect(next).toBeCalledWith();
        });

        test('throws PatchCurrentUserEmailAlreadyExists if email exists', async () => {
            expect.assertions(1);
            const email = 'person@gmail.com';
            const findOne = jest.fn(() => Promise.resolve(true));
            const UserModel = {
                findOne,
            };
            const request: any = { body: { email } };
            const response: any = { locals: {} };
            const next = jest.fn();
            const middleware = getDoesUserEmailExistMiddleware(UserModel as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(new CustomError(ErrorType.PatchCurrentUserEmailAlreadyExists));
        });
        test('calls next with PatchCurrentUserDoesUserEmailExistMiddleware error on middleware failure', async () => {
            expect.assertions(1);

            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getDoesUserEmailExistMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.PatchCurrentUserDoesUserEmailExistMiddleware, expect.any(Error)),
            );
        });
    });

    describe(`doesUsernameExistMiddleware`, () => {
        test('calls next() when username does not exist', async () => {
            const username = 'username';
            expect.assertions(2);
            const findOne = jest.fn(() => Promise.resolve(false));
            const UserModel = {
                findOne,
            };
            const request: any = { body: { username } };
            const response: any = {};
            const next = jest.fn();
            const middleware = getDoesUsernameExistMiddleware(UserModel as any);

            await middleware(request, response, next);

            expect(findOne).toBeCalledWith({
                $or: [{ username: username.toLowerCase() }, { cognitoUsername: username.toLowerCase() }],
            });
            expect(next).toBeCalledWith();
        });

        test('throws PatchCurrentUserUsernameAlreadyExists error when username exists', async () => {
            expect.assertions(2);
            const username = 'username';
            const findOne = jest.fn(() => Promise.resolve(true));
            const UserModel = {
                findOne,
            };
            const request: any = { body: { username } };
            const response: any = {};
            const next = jest.fn();
            const middleware = getDoesUsernameExistMiddleware(UserModel as any);

            await middleware(request, response, next);

            expect(findOne).toBeCalledWith({
                $or: [{ username: username.toLowerCase() }, { cognitoUsername: username.toLowerCase() }],
            });
            expect(next).toBeCalledWith(
                new CustomError(ErrorType.PatchCurrentUserUsernameAlreadyExists, expect.any(Error)),
            );
        });

        test('calls next with PatchCurrentUserDoesUsernameAlreadyExistMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getDoesUsernameExistMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.PatchCurrentUserDoesUsernameAlreadyExistMiddleware, expect.any(Error)),
            );
        });
    });

    describe('removeOldAndroidEndpointArnWhenPushNotificationIsUpdatedMiddleware', () => {
        test('removes android endpoint when user sends an androidToken and an androidEndpointArn in the request.body.', async () => {
            expect.assertions(5);
            const findByIdAndUpdate = jest.fn().mockResolvedValue(true);
            const userModel = {
                findByIdAndUpdate,
            } as any;
            const androidToken = 'token';
            const pushNotification = {
                androidToken,
            };
            const request: any = { body: { pushNotification } };
            const androidEndpointArn = 'androidEndpointArn';
            const user = { _id: '_id', pushNotification: { androidEndpointArn } };
            const response: any = { locals: { user } };
            const next = jest.fn();
            const getEndpoint = jest.fn().mockResolvedValue(true) as any;
            const deleteEndpoint = jest.fn().mockResolvedValue(true) as any;
            const middleware = getRemoveOldAndroidEndpointArnWhenPushNotificationIsUpdatedMiddleware({
                userModel,
                getEndpoint,
                deleteEndpoint,
            });

            await middleware(request, response, next);

            expect(getEndpoint).toBeCalledWith({ endpointArn: androidEndpointArn });
            expect(deleteEndpoint).toBeCalledWith({
                endpointArn: androidEndpointArn,
            });

            expect(findByIdAndUpdate).toBeCalledWith(
                user._id,
                {
                    $set: { pushNotification: { androidEndpointArn: null } },
                },
                { new: true },
            );
            expect(response.locals.user).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('throws RemoveOldAndroidEndpointArnWhenPushNotificationIsUpdatedMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getRemoveOldAndroidEndpointArnWhenPushNotificationIsUpdatedMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(
                    ErrorType.RemoveOldAndroidEndpointArnWhenPushNotificationIsUpdatedMiddleware,
                    expect.any(Error),
                ),
            );
        });
    });

    describe('removeOldIosEndpointArnWhenPushNotificationIsUpdatedMiddleware', () => {
        test('removes ios endpoint when user sends an iosToken and an iosEndpointArn in the request.body.', async () => {
            expect.assertions(5);
            const findByIdAndUpdate = jest.fn().mockResolvedValue(true);
            const userModel = {
                findByIdAndUpdate,
            } as any;
            const iosToken = 'token';
            const pushNotification = {
                iosToken,
            };
            const request: any = { body: { pushNotification } };
            const iosEndpointArn = 'iosEndpointArn';
            const user = { _id: '_id', pushNotification: { iosEndpointArn } };
            const response: any = { locals: { user } };
            const next = jest.fn();
            const getEndpoint = jest.fn().mockResolvedValue(true) as any;
            const deleteEndpoint = jest.fn().mockResolvedValue(true) as any;
            const middleware = getRemoveOldIosEndpointArnWhenPushNotificationIsUpdatedMiddleware({
                userModel,
                getEndpoint,
                deleteEndpoint,
            });

            await middleware(request, response, next);

            expect(getEndpoint).toBeCalledWith({ endpointArn: iosEndpointArn });
            expect(deleteEndpoint).toBeCalledWith({
                endpointArn: iosEndpointArn,
            });

            expect(findByIdAndUpdate).toBeCalledWith(
                user._id,
                {
                    $set: { pushNotification: { iosEndpointArn: null } },
                },
                { new: true },
            );
            expect(response.locals.user).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('throws RemoveOldIosEndpointArnWhenPushNotificationIsUpdatedMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getRemoveOldIosEndpointArnWhenPushNotificationIsUpdatedMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(
                    ErrorType.RemoveOldIosEndpointArnWhenPushNotificationIsUpdatedMiddleware,
                    expect.any(Error),
                ),
            );
        });
    });

    describe('createAndroidPlatformEndpointMiddleware', () => {
        test('creates android platform endpoint when request.body.pushNotification contains an android token.', async () => {
            expect.assertions(5);
            const androidToken = 'androidToken';
            const pushNotification = {
                androidToken,
            };
            const request: any = { body: { pushNotification } };
            const user = { _id: '_id' };
            const response: any = { locals: { user } };
            const next = jest.fn();
            const EndpointArn = '12345';
            const promise = jest.fn().mockResolvedValue({ EndpointArn });
            const createPlatformEndpoint = jest.fn(() => ({ promise }));
            const sns = {
                createPlatformEndpoint,
            } as any;
            const lean = jest.fn().mockResolvedValue(true);
            const findByIdAndUpdate = jest.fn(() => ({ lean }));
            const userModel = {
                findByIdAndUpdate,
            } as any;
            const middleware = getCreateAndroidPlatformEndpointMiddleware({ sns, userModel });

            await middleware(request, response, next);

            expect(createPlatformEndpoint).toBeCalledWith({
                PlatformApplicationArn: getServiceConfig().ANDROID_SNS_PLATFORM_APPLICATION_ARN,
                Token: androidToken,
                CustomUserData: user._id,
            });
            expect(promise).toBeCalledWith();
            expect(findByIdAndUpdate).toBeCalledWith(
                user._id,
                {
                    $set: { pushNotification: { androidEndpointArn: EndpointArn, androidToken } },
                },
                { new: true },
            );
            expect(response.locals.user).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('throws CreateAndroidPlatformEndpointMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getCreateAndroidPlatformEndpointMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.CreateAndroidPlatformEndpointMiddleware, expect.any(Error)),
            );
        });
    });

    describe('createIosPlatformEndpointMiddleware', () => {
        test('creates ios platform endpoint when deviceType is android and user does not have an endpointArn defined.', async () => {
            expect.assertions(5);
            const iosToken = 'androidToken';
            const pushNotification = {
                iosToken,
            };
            const request: any = { body: { pushNotification } };
            const user = { _id: '_id' };
            const response: any = { locals: { user } };
            const next = jest.fn();
            const EndpointArn = '12345';
            const promise = jest.fn().mockResolvedValue({ EndpointArn });
            const createPlatformEndpoint = jest.fn(() => ({ promise }));
            const sns = {
                createPlatformEndpoint,
            } as any;
            const lean = jest.fn().mockResolvedValue(true);
            const findByIdAndUpdate = jest.fn(() => ({ lean }));
            const userModel = {
                findByIdAndUpdate,
            } as any;
            const middleware = getCreateIosPlatformEndpointMiddleware({ sns, userModel });

            await middleware(request, response, next);

            expect(createPlatformEndpoint).toBeCalledWith({
                PlatformApplicationArn: getServiceConfig().IOS_SNS_PLATFORM_APPLICATION_ARN,
                Token: iosToken,
                CustomUserData: user._id,
            });
            expect(promise).toBeCalledWith();
            expect(findByIdAndUpdate).toBeCalledWith(
                user._id,
                {
                    $set: { pushNotification: { iosEndpointArn: EndpointArn, iosToken } },
                },
                { new: true },
            );
            expect(response.locals.user).toBeDefined();
            expect(next).toBeCalledWith();
        });

        test('throws CreateIosPlatformEndpointMiddleware error on middleware failure', async () => {
            expect.assertions(1);
            const request: any = {};
            const response: any = {};
            const next = jest.fn();
            const middleware = getCreateIosPlatformEndpointMiddleware({} as any);

            await middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.CreateIosPlatformEndpointMiddleware, expect.any(Error)),
            );
        });
    });

    describe('patchCurrentUserMiddleware', () => {
        test('sets response.locals.user', async () => {
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
            expect(response.locals.user).toBeDefined();
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
        test('populates userfollowing', async () => {
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
                new CustomError(ErrorType.PopulatePatchCurrentUserFollowingMiddleware, expect.any(Error)),
            );
        });
    });

    describe('populateCurrentUserFollowersMiddleware', () => {
        test('populates users following', async () => {
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
            const following: BasicUser[] = [];
            const followers: BasicUser[] = [];
            const achievements: DatabaseAchievementType[] = [];
            const user = getMockUser();
            const response: any = { locals: { user, following, followers, achievements } };
            const next = jest.fn();

            const getPopulatedCurrentUserFunction = jest.fn();

            const middleware = getFormatUserMiddleware(getPopulatedCurrentUserFunction);

            middleware(request, response, next);

            expect(getPopulatedCurrentUserFunction).toBeCalledWith({
                user,
                following,
                followers,
                achievements,
            });
            expect(next).toBeCalled();
        });

        test('calls next with GetCurrentUserFormatUserMiddleware error on middleware failure', () => {
            expect.assertions(1);
            const response: any = {};
            const request: any = {};
            const next = jest.fn();

            const middleware = getFormatUserMiddleware({} as any);

            middleware(request, response, next);

            expect(next).toBeCalledWith(
                new CustomError(ErrorType.PatchCurrentUserFormatUserMiddleware, expect.any(Error)),
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
        expect.assertions(14);

        expect(patchCurrentUserMiddlewares.length).toBe(13);
        expect(patchCurrentUserMiddlewares[0]).toBe(patchCurrentUserRequestBodyValidationMiddleware);
        expect(patchCurrentUserMiddlewares[1]).toBe(doesUserEmailExistMiddleware);
        expect(patchCurrentUserMiddlewares[2]).toBe(doesUsernameExistMiddleware);
        expect(patchCurrentUserMiddlewares[3]).toBe(removeOldAndroidEndpointArnWhenPushNotificationIsUpdatedMiddleware);
        expect(patchCurrentUserMiddlewares[4]).toBe(removeOldIosEndpointArnWhenPushNotificationIsUpdatedMiddleware);
        expect(patchCurrentUserMiddlewares[5]).toBe(createAndroidPlatformEndpointMiddleware);
        expect(patchCurrentUserMiddlewares[6]).toBe(createIosPlatformEndpointMiddleware);
        expect(patchCurrentUserMiddlewares[7]).toBe(patchCurrentUserMiddleware);
        expect(patchCurrentUserMiddlewares[8]).toBe(populateCurrentUserFollowingMiddleware);
        expect(patchCurrentUserMiddlewares[9]).toBe(populateCurrentUserFollowersMiddleware);
        expect(patchCurrentUserMiddlewares[10]).toBe(populateCurrentUserAchievementsMiddleware);
        expect(patchCurrentUserMiddlewares[11]).toBe(formatUserMiddleware);
        expect(patchCurrentUserMiddlewares[12]).toBe(sendUpdatedCurrentUserMiddleware);
    });
});
