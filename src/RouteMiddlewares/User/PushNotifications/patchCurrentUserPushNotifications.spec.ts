/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseCodes } from '../../../Server/responseCodes';
import { CustomError, ErrorType } from '../../../customError';
import {
    patchCurrentUserPushNotificationsMiddlewares,
    patchCurrentUserPushNotificationsRequestBodyValidationMiddleware,
    sendUpdatedCurrentUserPushNotificationsMiddleware,
    getPatchCurrentUserPushNotificationsMiddleware,
    patchCurrentUserPushNotificationsMiddleware,
} from './patchCurrentUserPushNotifications';
import { UserPushNotifications, PushNotificationTypes } from '@streakoid/streakoid-sdk/lib';
import {
    CustomStreakReminder,
    CustomTeamMemberStreakReminder,
    CustomChallengeStreakReminder,
    CustomSoloStreakReminder,
} from '@streakoid/streakoid-sdk/lib/models/PushNotifications';

describe('patchCurrentUserRequestBodyValidationMiddleware', () => {
    const customSoloStreakReminder: CustomSoloStreakReminder = {
        expoId: 'expoId',
        enabled: true,
        reminderHour: 10,
        reminderMinute: 5,
        soloStreakId: 'soloStreakId',
        soloStreakName: 'Reading',
        pushNotificationType: PushNotificationTypes.customSoloStreakReminder,
    };
    const customChallengeStreakReminder: CustomChallengeStreakReminder = {
        expoId: 'expoId',
        enabled: true,
        reminderHour: 10,
        reminderMinute: 5,
        challengeStreakId: 'challengeStreakId',
        challengeId: 'challengeId',
        challengeName: 'Reading',
        pushNotificationType: PushNotificationTypes.customChallengeStreakReminder,
    };
    const customTeamMemberStreakReminder: CustomTeamMemberStreakReminder = {
        expoId: 'expoId',
        enabled: true,
        reminderHour: 10,
        reminderMinute: 5,
        teamMemberStreakId: 'challengeStreakId',
        teamStreakId: 'challengeId',
        teamStreakName: 'Reading',
        pushNotificationType: PushNotificationTypes.customTeamMemberStreakReminder,
    };
    const customStreakReminders: CustomStreakReminder[] = [
        customSoloStreakReminder,
        customChallengeStreakReminder,
        customTeamMemberStreakReminder,
    ];
    const values: UserPushNotifications = {
        completeAllStreaksReminder: {
            enabled: true,
            expoId: 'expoId',
            reminderHour: 22,
            reminderMinute: 10,
            pushNotificationType: PushNotificationTypes.completeAllStreaksReminder,
        },
        teamStreakUpdates: {
            enabled: true,
        },
        badgeUpdates: {
            enabled: true,
        },
        newFollowerUpdates: {
            enabled: true,
        },
        customStreakReminders,
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

        patchCurrentUserPushNotificationsRequestBodyValidationMiddleware(request, response, next);

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

        patchCurrentUserPushNotificationsRequestBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.badRequest);
        expect(send).toBeCalledWith({
            message: '"unsupportedKey" is not allowed',
        });
        expect(next).not.toBeCalled();
    });
});

describe('patchCurrentUserPushNotificationsMiddleware', () => {
    test('sets response.locals.pushNotifications', async () => {
        expect.assertions(4);
        const user = {
            _id: '_id',
        };
        const pushNotifications: UserPushNotifications = {
            teamStreakUpdates: {
                enabled: true,
            },
            badgeUpdates: {
                enabled: true,
            },
            newFollowerUpdates: {
                enabled: true,
            },
            completeAllStreaksReminder: {
                enabled: true,
                expoId: 'expoId',
                reminderHour: 22,
                reminderMinute: 21,
                pushNotificationType: PushNotificationTypes.completeAllStreaksReminder,
            },
            customStreakReminders: [],
        };
        const request: any = {
            body: {
                pushNotifications,
            },
        };
        const response: any = { locals: { user } };
        const next = jest.fn();
        const lean = jest.fn().mockResolvedValue({ pushNotifications: [] });
        const findByIdAndUpdate = jest.fn(() => ({ lean }));
        const userModel = {
            findByIdAndUpdate,
        };
        const middleware = getPatchCurrentUserPushNotificationsMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(findByIdAndUpdate).toBeCalledWith(user._id, { pushNotifications: request.body }, { new: true });
        expect(lean).toBeCalled();
        expect(response.locals.pushNotifications).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('throws UpdateCurrentUsersPushNotificationsUserNotFound error when user is not found', async () => {
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
        const middleware = getPatchCurrentUserPushNotificationsMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.UpdateCurrentUsersPushNotificationsUserNotFound));
    });

    test('calls next with PatchCurrentUserPushNotificationsMiddleware on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();

        const middleware = getPatchCurrentUserPushNotificationsMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.PatchCurrentUserPushNotificationsMiddleware));
    });
});

describe('sendUpdatedCurrentUserMiddleware', () => {
    test('sends updated current user push notifications', () => {
        expect.assertions(3);
        const pushNotifications: UserPushNotifications = {
            teamStreakUpdates: {
                enabled: true,
            },
            badgeUpdates: {
                enabled: true,
            },
            newFollowerUpdates: {
                enabled: true,
            },
            completeAllStreaksReminder: {
                enabled: true,
                expoId: 'expoId',
                reminderHour: 22,
                reminderMinute: 21,
                pushNotificationType: PushNotificationTypes.completeAllStreaksReminder,
            },
            customStreakReminders: [],
        };
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const response: any = { locals: { pushNotifications }, status };
        const request: any = {};
        const next = jest.fn();

        sendUpdatedCurrentUserPushNotificationsMiddleware(request, response, next);

        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(ResponseCodes.success);
        expect(send).toBeCalledWith(pushNotifications);
    });

    test('calls next with SendUpdatedCurrentUserMiddleware error on middleware failure', () => {
        expect.assertions(1);

        const response: any = {};
        const request: any = {};
        const next = jest.fn();

        sendUpdatedCurrentUserPushNotificationsMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendUpdatedCurrentUserMiddleware, expect.any(Error)));
    });
});

describe('patchCurrentUserPushNotificationsMiddlewares', () => {
    test('are defined in the correct order', () => {
        expect.assertions(4);

        expect(patchCurrentUserPushNotificationsMiddlewares.length).toBe(3);
        expect(patchCurrentUserPushNotificationsMiddlewares[0]).toBe(
            patchCurrentUserPushNotificationsRequestBodyValidationMiddleware,
        );
        expect(patchCurrentUserPushNotificationsMiddlewares[1]).toBe(patchCurrentUserPushNotificationsMiddleware);
        expect(patchCurrentUserPushNotificationsMiddlewares[2]).toBe(sendUpdatedCurrentUserPushNotificationsMiddleware);
    });
});
