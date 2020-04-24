import streakoid from '../../streakoid';
import {
    ChallengeStreak,
    StreakTrackingEvent,
    StreakTrackingEventTypes,
    StreakTypes,
} from '@streakoid/streakoid-models/lib';
import { challengeStreakModel } from '../../../src/Models/ChallengeStreak';

export const trackMaintainedChallengeStreaks = async (
    maintainedChallengeStreaks: ChallengeStreak[],
): Promise<StreakTrackingEvent[]> => {
    return Promise.all(
        maintainedChallengeStreaks.map(async challengeStreak => {
            await challengeStreakModel.findByIdAndUpdate(challengeStreak._id, { $set: { completedToday: false } });
            return streakoid.streakTrackingEvents.create({
                type: StreakTrackingEventTypes.maintainedStreak,
                streakId: challengeStreak._id,
                userId: challengeStreak.userId,
                streakType: StreakTypes.challenge,
            });
        }),
    );
};
