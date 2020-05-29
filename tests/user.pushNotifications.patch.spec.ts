import { isTestEnvironment } from './setup/isTestEnvironment';
import { setupDatabase } from './setup/setupDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import {
    CompleteAllStreaksReminder,
    CustomStreakReminder,
    CustomSoloStreakReminder,
    CustomChallengeStreakReminder,
    CustomTeamStreakReminder,
} from '@streakoid/streakoid-models/lib/Models/StreakReminders';
import StreakReminderTypes from '@streakoid/streakoid-models/lib/Types/StreakReminderTypes';
import { Mongoose } from 'mongoose';
import { StreakoidSDK } from '@streakoid/streakoid-sdk/lib/streakoidSDKFactory';
import { streakoidTestSDK } from './setup/streakoidTestSDK';
import { disconnectDatabase } from './setup/disconnectDatabase';
import { getPayingUser } from './setup/getPayingUser';

jest.setTimeout(120000);

const testName = 'PATCH-user-push-notifications';

describe(testName, () => {
    let database: Mongoose;
    let SDK: StreakoidSDK;
    beforeAll(async () => {
        if (isTestEnvironment()) {
            database = await setupDatabase({ testName });
            SDK = streakoidTestSDK({ testName });
        }
    });

    afterEach(async () => {
        if (isTestEnvironment()) {
            await tearDownDatabase({ database });
        }
    });

    afterAll(async () => {
        if (isTestEnvironment()) {
            await disconnectDatabase({ database });
        }
    });
    test(`that completeAllStreaksReminder can be updated by itself`, async () => {
        expect.assertions(8);

        await getPayingUser({ testName });

        const completeAllStreaksReminder: CompleteAllStreaksReminder = {
            enabled: true,
            expoId: 'expoId',
            reminderHour: 10,
            reminderMinute: 5,
            streakReminderType: StreakReminderTypes.completeAllStreaksReminder,
        };

        const updatedStreakReminders = await SDK.user.pushNotifications.updatePushNotifications({
            completeAllStreaksReminder,
        });

        expect(updatedStreakReminders.completeAllStreaksReminder).toBeDefined();

        if (updatedStreakReminders.completeAllStreaksReminder) {
            expect(Object.keys(updatedStreakReminders.completeAllStreaksReminder).sort()).toEqual(
                ['enabled', 'expoId', 'reminderHour', 'reminderMinute', 'streakReminderType'].sort(),
            );
            expect(updatedStreakReminders.completeAllStreaksReminder.enabled).toEqual(
                completeAllStreaksReminder.enabled,
            );
            expect(updatedStreakReminders.completeAllStreaksReminder.reminderHour).toEqual(
                completeAllStreaksReminder.reminderHour,
            );
            expect(updatedStreakReminders.completeAllStreaksReminder.reminderMinute).toEqual(
                completeAllStreaksReminder.reminderMinute,
            );
            expect(updatedStreakReminders.completeAllStreaksReminder.expoId).toEqual(completeAllStreaksReminder.expoId);
            expect(updatedStreakReminders.completeAllStreaksReminder.streakReminderType).toEqual(
                StreakReminderTypes.completeAllStreaksReminder,
            );

            expect(Object.keys(updatedStreakReminders).sort()).toEqual(
                [
                    'completeAllStreaksReminder',
                    'newFollowerUpdates',
                    'teamStreakUpdates',
                    'achievementUpdates',
                    'customStreakReminders',
                ].sort(),
            );
        }
    });

    test(`that customStreakReminders can be updated by itself with each of the different types of custom streak reminders.`, async () => {
        expect.assertions(27);

        await getPayingUser({ testName });

        const customSoloStreakReminder: CustomSoloStreakReminder = {
            expoId: 'expoId',
            enabled: true,
            reminderHour: 10,
            reminderMinute: 5,
            soloStreakId: 'soloStreakId',
            soloStreakName: 'Reading',
            streakReminderType: StreakReminderTypes.customSoloStreakReminder,
        };
        const customChallengeStreakReminder: CustomChallengeStreakReminder = {
            expoId: 'expoId',
            enabled: true,
            reminderHour: 10,
            reminderMinute: 5,
            challengeStreakId: 'challengeStreakId',
            challengeId: 'challengeId',
            challengeName: 'Reading',
            streakReminderType: StreakReminderTypes.customChallengeStreakReminder,
        };
        const customTeamStreakReminder: CustomTeamStreakReminder = {
            expoId: 'expoId',
            enabled: true,
            reminderHour: 10,
            reminderMinute: 5,
            teamStreakId: 'teamStreakId',
            teamStreakName: 'Reading',
            streakReminderType: StreakReminderTypes.customTeamStreakReminder,
        };
        const customStreakReminders: CustomStreakReminder[] = [
            customSoloStreakReminder,
            customChallengeStreakReminder,
            customTeamStreakReminder,
        ];

        const updatedStreakReminders = await SDK.user.pushNotifications.updatePushNotifications({
            customStreakReminders,
        });

        expect(Object.keys(updatedStreakReminders).sort()).toEqual(
            ['newFollowerUpdates', 'teamStreakUpdates', 'customStreakReminders', 'achievementUpdates'].sort(),
        );

        expect(updatedStreakReminders.customStreakReminders.length).toEqual(3);

        const updatedSoloStreak = updatedStreakReminders.customStreakReminders.find(
            pushNotification => pushNotification.streakReminderType === StreakReminderTypes.customSoloStreakReminder,
        );

        if (
            updatedSoloStreak &&
            updatedSoloStreak.streakReminderType === StreakReminderTypes.customSoloStreakReminder
        ) {
            expect(updatedSoloStreak.enabled).toEqual(updatedSoloStreak.enabled);
            expect(updatedSoloStreak.reminderHour).toEqual(updatedSoloStreak.reminderHour);
            expect(updatedSoloStreak.reminderMinute).toEqual(updatedSoloStreak.reminderMinute);
            expect(updatedSoloStreak.streakReminderType).toEqual(StreakReminderTypes.customSoloStreakReminder);
            expect(updatedSoloStreak.expoId).toEqual(updatedSoloStreak.expoId);
            expect(updatedSoloStreak.soloStreakId).toEqual(customSoloStreakReminder.soloStreakId);
            expect(updatedSoloStreak.soloStreakName).toEqual(customSoloStreakReminder.soloStreakName);
            expect(Object.keys(updatedSoloStreak).sort()).toEqual(
                [
                    'enabled',
                    'expoId',
                    'reminderHour',
                    'reminderMinute',
                    'streakReminderType',
                    'soloStreakName',
                    'soloStreakId',
                ].sort(),
            );
        }

        const updatedChallengeStreak = updatedStreakReminders.customStreakReminders.find(
            pushNotification =>
                pushNotification.streakReminderType === StreakReminderTypes.customChallengeStreakReminder,
        );

        if (
            updatedChallengeStreak &&
            updatedChallengeStreak.streakReminderType === StreakReminderTypes.customChallengeStreakReminder
        ) {
            expect(updatedChallengeStreak.enabled).toEqual(updatedChallengeStreak.enabled);
            expect(updatedChallengeStreak.reminderHour).toEqual(updatedChallengeStreak.reminderHour);
            expect(updatedChallengeStreak.reminderMinute).toEqual(updatedChallengeStreak.reminderMinute);
            expect(updatedChallengeStreak.streakReminderType).toEqual(
                StreakReminderTypes.customChallengeStreakReminder,
            );
            expect(updatedChallengeStreak.expoId).toEqual(updatedChallengeStreak.expoId);
            expect(updatedChallengeStreak.challengeStreakId).toEqual(customChallengeStreakReminder.challengeStreakId);
            expect(updatedChallengeStreak.challengeName).toEqual(customChallengeStreakReminder.challengeName);
            expect(updatedChallengeStreak.challengeId).toEqual(customChallengeStreakReminder.challengeId);
            expect(Object.keys(updatedChallengeStreak).sort()).toEqual(
                [
                    'enabled',
                    'expoId',
                    'reminderHour',
                    'reminderMinute',
                    'streakReminderType',
                    'challengeStreakId',
                    'challengeId',
                    'challengeName',
                ].sort(),
            );
        }

        const updatedTeamMemberStreak = updatedStreakReminders.customStreakReminders.find(
            pushNotification => pushNotification.streakReminderType === StreakReminderTypes.customTeamStreakReminder,
        );

        if (
            updatedTeamMemberStreak &&
            updatedTeamMemberStreak.streakReminderType === StreakReminderTypes.customTeamStreakReminder
        ) {
            expect(updatedTeamMemberStreak.enabled).toEqual(updatedTeamMemberStreak.enabled);
            expect(updatedTeamMemberStreak.reminderHour).toEqual(updatedTeamMemberStreak.reminderHour);
            expect(updatedTeamMemberStreak.reminderMinute).toEqual(updatedTeamMemberStreak.reminderMinute);
            expect(updatedTeamMemberStreak.streakReminderType).toEqual(StreakReminderTypes.customTeamStreakReminder);
            expect(updatedTeamMemberStreak.expoId).toEqual(updatedTeamMemberStreak.expoId);
            expect(updatedTeamMemberStreak.teamStreakId).toEqual(customTeamStreakReminder.teamStreakId);
            expect(updatedTeamMemberStreak.teamStreakName).toEqual(customTeamStreakReminder.teamStreakName);
            expect(Object.keys(updatedTeamMemberStreak).sort()).toEqual(
                [
                    'enabled',
                    'expoId',
                    'reminderHour',
                    'reminderMinute',
                    'streakReminderType',
                    'teamStreakId',
                    'teamStreakName',
                ].sort(),
            );
        }
    });

    test(`that teaStreakUpdates can be disabled by themselves`, async () => {
        await getPayingUser({ testName });
        const updatedStreakReminders = await SDK.user.pushNotifications.updatePushNotifications({
            teamStreakUpdates: {
                enabled: false,
            },
        });
        expect(Object.keys(updatedStreakReminders).sort()).toEqual(
            ['newFollowerUpdates', 'teamStreakUpdates', 'customStreakReminders', 'achievementUpdates'].sort(),
        );

        expect(updatedStreakReminders.teamStreakUpdates.enabled).toEqual(false);
    });

    test(`that newFollowerUpdates can be disabled by themselves`, async () => {
        await getPayingUser({ testName });
        const updatedStreakReminders = await SDK.user.pushNotifications.updatePushNotifications({
            newFollowerUpdates: {
                enabled: false,
            },
        });
        expect(Object.keys(updatedStreakReminders).sort()).toEqual(
            ['newFollowerUpdates', 'teamStreakUpdates', 'customStreakReminders', 'achievementUpdates'].sort(),
        );

        expect(updatedStreakReminders.newFollowerUpdates.enabled).toEqual(false);
    });

    test(`that achievementUpdates can be disabled by themselves`, async () => {
        await getPayingUser({ testName });
        const updatedStreakReminders = await SDK.user.pushNotifications.updatePushNotifications({
            achievementUpdates: {
                enabled: false,
            },
        });
        expect(Object.keys(updatedStreakReminders).sort()).toEqual(
            ['newFollowerUpdates', 'teamStreakUpdates', 'customStreakReminders', 'achievementUpdates'].sort(),
        );

        expect(updatedStreakReminders.achievementUpdates.enabled).toEqual(false);
    });
});
