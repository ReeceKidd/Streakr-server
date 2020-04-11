import streakoid from '../../streakoid';
import {
    SoloStreak,
    CurrentStreak,
    PastStreak,
    StreakTrackingEvent,
    StreakTrackingEventTypes,
    StreakTypes,
    ActivityFeedItemTypes,
    ActivityFeedItemType,
} from '@streakoid/streakoid-sdk/lib';
import { soloStreakModel } from '../../../src/Models/SoloStreak';

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

            const user = await streakoid.users.getOne(soloStreak.userId);

            const lostStreakActivityFeedItem: ActivityFeedItemType = {
                activityFeedItemType: ActivityFeedItemTypes.lostSoloStreak,
                userId: soloStreak.userId,
                username: user && user.username,
                userProfileImage: user && user.profileImages && user.profileImages.originalImageUrl,
                soloStreakId: soloStreak._id,
                soloStreakName: soloStreak.streakName,
                numberOfDaysLost: pastStreak.numberOfDaysInARow,
            };

            await streakoid.activityFeedItems.create(lostStreakActivityFeedItem);

            return streakoid.streakTrackingEvents.create({
                type: StreakTrackingEventTypes.lostStreak,
                streakId: soloStreak._id,
                userId: soloStreak.userId,
                streakType: StreakTypes.solo,
            });
        }),
    );
};
