import {
    CompleteAllStreaksReminder,
    CustomSoloStreakReminder,
    CustomTeamStreakReminder,
    CustomChallengeStreakReminder,
    CustomStreakReminder,
} from '@streakoid/streakoid-models/lib/Models/StreakReminders';
import { UserPushNotifications } from '@streakoid/streakoid-models/lib/Models/UserPushNotifications';
import StreakReminderTypes from '@streakoid/streakoid-models/lib/Types/StreakReminderTypes';
import { pushNotifications as pushNotificationsImport } from './user.pushNotifications';

describe('SDK pushNotifications', () => {
    const patchRequest = jest.fn().mockResolvedValue(true);
    const pushNotifications = pushNotificationsImport({
        patchRequest,
    });

    describe('update', () => {
        test('calls PATCH with correct URL and  parameters', async () => {
            expect.assertions(1);

            const completeAllStreaksReminder: CompleteAllStreaksReminder = {
                streakReminderType: StreakReminderTypes.completeAllStreaksReminder,
                enabled: true,
                expoId: 'expoId',
                reminderHour: 10,
                reminderMinute: 10,
            };
            const customSoloStreakReminder: CustomSoloStreakReminder = {
                streakReminderType: StreakReminderTypes.customSoloStreakReminder,
                expoId: 'expoId',
                enabled: true,
                reminderHour: 10,
                reminderMinute: 5,
                soloStreakId: 'soloStreakId',
                soloStreakName: 'Reading',
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
            const customTeamMemberStreakReminder: CustomTeamStreakReminder = {
                expoId: 'expoId',
                enabled: true,
                reminderHour: 10,
                reminderMinute: 5,
                teamStreakId: 'challengeId',
                teamStreakName: 'Reading',
                streakReminderType: StreakReminderTypes.customTeamStreakReminder,
            };

            const customStreakReminders: CustomStreakReminder[] = [
                customSoloStreakReminder,
                customChallengeStreakReminder,
                customTeamMemberStreakReminder,
            ];

            const updateData: UserPushNotifications = {
                completeAllStreaksReminder,
                teamStreakUpdates: {
                    enabled: true,
                },
                newFollowerUpdates: {
                    enabled: true,
                },
                achievementUpdates: {
                    enabled: true,
                },
                customStreakReminders,
            };

            await pushNotifications.updatePushNotifications({ ...updateData });

            expect(patchRequest).toBeCalledWith({ route: `/v1/user/push-notifications`, params: updateData });
        });
    });
});
