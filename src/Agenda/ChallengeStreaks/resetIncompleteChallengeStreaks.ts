import streakoid from '../../streakoid';
import {
    ChallengeStreak,
    CurrentStreak,
    PastStreak,
    StreakTrackingEvent,
    StreakTrackingEventTypes,
    StreakTypes,
    ActivityFeedItemTypes,
    ActivityFeedItemType,
} from '@streakoid/streakoid-models/lib';
import { challengeStreakModel } from '../../../src/Models/ChallengeStreak';

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
