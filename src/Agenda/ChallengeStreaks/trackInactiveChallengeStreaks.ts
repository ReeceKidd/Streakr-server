import streakoid from '../../streakoid';
import { ChallengeStreak } from '@streakoid/streakoid-models/lib/Models/ChallengeStreak';
import { StreakTrackingEvent } from '@streakoid/streakoid-models/lib/Models/StreakTrackingEvent';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';

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
