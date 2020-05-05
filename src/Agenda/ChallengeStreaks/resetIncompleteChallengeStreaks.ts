import streakoid from '../../streakoid';
import { challengeStreakModel } from '../../../src/Models/ChallengeStreak';
import { ChallengeStreak } from '@streakoid/streakoid-models/lib/Models/ChallengeStreak';
import { StreakTrackingEvent } from '@streakoid/streakoid-models/lib/Models/StreakTrackingEvent';
import { PastStreak } from '@streakoid/streakoid-models/lib/Models/PastStreak';
import { CurrentStreak } from '@streakoid/streakoid-models/lib/Models/CurrentStreak';
import { ActivityFeedItemType } from '@streakoid/streakoid-models/lib/Models/ActivityFeedItemType';
import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';

export const resetIncompleteChallengeStreaks = async (
    incompleteChallengeStreaks: ChallengeStreak[],
    endDate: string,
): Promise<StreakTrackingEvent[]> => {
    return Promise.all(
        incompleteChallengeStreaks.map(async challengeStreak => {
            const pastStreak: PastStreak = {
                endDate: endDate,
                startDate: challengeStreak.currentStreak.startDate || endDate,
                numberOfDaysInARow: challengeStreak.currentStreak.numberOfDaysInARow,
            };

            const pastStreaks: PastStreak[] = [...challengeStreak.pastStreaks, pastStreak];

            const currentStreak: CurrentStreak = {
                startDate: '',
                numberOfDaysInARow: 0,
            };

            await challengeStreakModel.findByIdAndUpdate(challengeStreak._id, {
                $set: {
                    currentStreak,
                    pastStreaks,
                    active: false,
                },
            });

            const user = await streakoid.users.getOne(challengeStreak.userId);
            const challenge = await streakoid.challenges.getOne({
                challengeId: challengeStreak.challengeId,
            });

            const lostChallengeStreakActivityFeedItem: ActivityFeedItemType = {
                activityFeedItemType: ActivityFeedItemTypes.lostChallengeStreak,
                userId: challengeStreak.userId,
                username: user && user.username,
                userProfileImage: user && user.profileImages && user.profileImages.originalImageUrl,
                challengeStreakId: challengeStreak._id,
                challengeId: challenge._id,
                challengeName: challenge.name,
                numberOfDaysLost: pastStreak.numberOfDaysInARow,
            };

            await streakoid.activityFeedItems.create(lostChallengeStreakActivityFeedItem);

            return streakoid.streakTrackingEvents.create({
                type: StreakTrackingEventTypes.lostStreak,
                streakId: challengeStreak._id,
                userId: challengeStreak.userId,
                streakType: StreakTypes.challenge,
            });
        }),
    );
};
