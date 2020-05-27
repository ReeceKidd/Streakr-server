import ApiVersions from './ApiVersions';
import {
    CompleteAllStreaksReminder,
    CustomStreakReminder,
} from '@streakoid/streakoid-models/lib/Models/StreakReminders';
import { UserPushNotifications } from '@streakoid/streakoid-models/lib/Models/UserPushNotifications';
import RouterCategories from '@streakoid/streakoid-models/lib/Types/RouterCategories';
import { PatchRequest } from './request';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const pushNotifications = ({ patchRequest }: { patchRequest: PatchRequest }) => {
    const updatePushNotifications = async ({
        completeAllStreaksReminder,
        customStreakReminders,
        teamStreakUpdates,
        newFollowerUpdates,
        achievementUpdates,
    }: {
        completeAllStreaksReminder?: CompleteAllStreaksReminder;
        customStreakReminders?: CustomStreakReminder[];
        teamStreakUpdates?: { enabled: boolean };
        newFollowerUpdates?: { enabled: boolean };
        achievementUpdates?: { enabled: boolean };
    }): Promise<UserPushNotifications> => {
        try {
            const updateData = {
                completeAllStreaksReminder,
                customStreakReminders,
                teamStreakUpdates,
                newFollowerUpdates,
                achievementUpdates,
            };
            return patchRequest({
                route: `/${ApiVersions.v1}/${RouterCategories.user}/push-notifications`,
                params: updateData,
            });
        } catch (err) {
            return Promise.reject(err);
        }
    };

    return {
        updatePushNotifications,
    };
};

export { pushNotifications };
