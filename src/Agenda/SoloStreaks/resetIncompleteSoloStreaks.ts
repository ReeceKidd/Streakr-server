import { soloStreakModel } from '../../../src/Models/SoloStreak';
import { SoloStreak } from '@streakoid/streakoid-models/lib/Models/SoloStreak';
import { StreakTrackingEvent } from '@streakoid/streakoid-models/lib/Models/StreakTrackingEvent';
import { PastStreak } from '@streakoid/streakoid-models/lib/Models/PastStreak';
import { CurrentStreak } from '@streakoid/streakoid-models/lib/Models/CurrentStreak';
import { ActivityFeedItemType } from '@streakoid/streakoid-models/lib/Models/ActivityFeedItemType';
import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import { userModel } from '../../Models/User';
import { User } from '@streakoid/streakoid-models/lib/Models/User';
import { createActivityFeedItem } from '../../helpers/createActivityFeedItem';
import { createStreakTrackingEvent } from '../../helpers/createStreakTrackingEvent';
import { UserStreakHelper } from '../../helpers/UserStreakHelper';

export const resetIncompleteSoloStreaks = async (
    incompleteSoloStreaks: SoloStreak[],
    endDate: string,
): Promise<StreakTrackingEvent[]> => {
    return Promise.all(
        incompleteSoloStreaks.map(async soloStreak => {
            const pastStreak: PastStreak = {
                endDate: endDate,
                startDate: soloStreak.currentStreak.startDate || endDate,
                numberOfDaysInARow: soloStreak.currentStreak.numberOfDaysInARow,
            };

            const pastStreaks: PastStreak[] = [...soloStreak.pastStreaks, pastStreak];

            const currentStreak: CurrentStreak = {
                startDate: '',
                numberOfDaysInARow: 0,
            };

            await soloStreakModel.findByIdAndUpdate(soloStreak._id, {
                $set: {
                    currentStreak,
                    pastStreaks,
                    active: false,
                },
            });

            const user: User | null = await userModel.findById(soloStreak.userId);

            const longestCurrentStreak = user && user.longestCurrentStreak;

            if (
                longestCurrentStreak &&
                longestCurrentStreak.streakType === StreakTypes.solo &&
                longestCurrentStreak.soloStreakId &&
                longestCurrentStreak.soloStreakId === soloStreak._id &&
                user
            ) {
                await UserStreakHelper.updateUsersLongestCurrentStreak({ userId: user._id });
            }

            const longestEverStreak = user && user.longestEverStreak;

            if (
                longestEverStreak &&
                longestEverStreak.streakType === StreakTypes.solo &&
                longestEverStreak.soloStreakId &&
                longestEverStreak.soloStreakId === soloStreak._id &&
                user
            ) {
                await userModel.findByIdAndUpdate(user._id, {
                    $set: {
                        longestEverStreak: {
                            ...user.longestEverStreak,
                            endDate,
                        },
                    },
                });
            }

            const longestSoloStreak = user && user.longestSoloStreak;

            if (
                longestSoloStreak &&
                longestSoloStreak.streakType === StreakTypes.solo &&
                longestSoloStreak.soloStreakId &&
                longestSoloStreak.soloStreakId === soloStreak._id &&
                user
            ) {
                await userModel.findByIdAndUpdate(user._id, {
                    $set: {
                        longestSoloStreak: {
                            ...user.longestSoloStreak,
                            endDate,
                        },
                    },
                });
            }

            const lostStreakActivityFeedItem: ActivityFeedItemType = {
                activityFeedItemType: ActivityFeedItemTypes.lostSoloStreak,
                userId: soloStreak.userId,
                username: (user && user.username) || '',
                userProfileImage: (user && user.profileImages && user.profileImages.originalImageUrl) || '',
                soloStreakId: soloStreak._id,
                soloStreakName: soloStreak.streakName,
                numberOfDaysLost: pastStreak.numberOfDaysInARow,
            };

            await createActivityFeedItem(lostStreakActivityFeedItem);

            return createStreakTrackingEvent({
                type: StreakTrackingEventTypes.lostStreak,
                streakId: soloStreak._id,
                userId: soloStreak.userId,
                streakType: StreakTypes.solo,
            });
        }),
    );
};
