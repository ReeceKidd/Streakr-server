import { challengeStreakModel } from '../../../src/Models/ChallengeStreak';
import { ChallengeStreak } from '@streakoid/streakoid-models/lib/Models/ChallengeStreak';
import { StreakTrackingEvent } from '@streakoid/streakoid-models/lib/Models/StreakTrackingEvent';
import { PastStreak } from '@streakoid/streakoid-models/lib/Models/PastStreak';
import { CurrentStreak } from '@streakoid/streakoid-models/lib/Models/CurrentStreak';
import { ActivityFeedItemType } from '@streakoid/streakoid-models/lib/Models/ActivityFeedItemType';
import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import { userModel } from '../../Models/User';
import { challengeModel } from '../../Models/Challenge';
import { Challenge } from '@streakoid/streakoid-models/lib/Models/Challenge';
import { User } from '@streakoid/streakoid-models/lib/Models/User';
import { createActivityFeedItem } from '../../helpers/createActivityFeedItem';
import { createStreakTrackingEvent } from '../../helpers/createStreakTrackingEvent';

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

            const user: User | null = await userModel.findById(challengeStreak.userId);

            const challenge: Challenge | null = await challengeModel.findById(challengeStreak.challengeId);

            const lostChallengeStreakActivityFeedItem: ActivityFeedItemType = {
                activityFeedItemType: ActivityFeedItemTypes.lostChallengeStreak,
                userId: challengeStreak.userId,
                username: (user && user.username) || '',
                userProfileImage: (user && user.profileImages && user.profileImages.originalImageUrl) || '',
                challengeStreakId: challengeStreak._id,
                challengeId: (challenge && challenge._id) || '',
                challengeName: (challenge && challenge.name) || '',
                numberOfDaysLost: pastStreak.numberOfDaysInARow,
            };

            await createActivityFeedItem(lostChallengeStreakActivityFeedItem);

            const streakTrackingEvent = await createStreakTrackingEvent({
                type: StreakTrackingEventTypes.lostStreak,
                streakId: challengeStreak._id,
                userId: challengeStreak.userId,
                streakType: StreakTypes.challenge,
            });
            return streakTrackingEvent;
        }),
    );
};
