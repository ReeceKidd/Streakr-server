import streakoid from '../../streakoid';
import {
    ChallengeStreak,
    StreakTrackingEvent,
    StreakTrackingEventTypes,
    StreakTypes,
} from '@streakoid/streakoid-sdk/lib';

export const trackInactiveChallengeStreaks = async (
    inactiveChallengeStreaks: ChallengeStreak[],
): Promise<StreakTrackingEvent[]> => {
    return Promise.all(
        inactiveChallengeStreaks.map(async challengeStreak => {
            return streakoid.streakTrackingEvents.create({
                type: StreakTrackingEventTypes.inactiveStreak,
                streakId: challengeStreak._id,
                userId: challengeStreak.userId,
                streakType: StreakTypes.challenge,
            });
        }),
    );
};
