import { challengeStreakModel } from '../../../src/Models/ChallengeStreak';
import { ChallengeStreak } from '@streakoid/streakoid-models/lib/Models/ChallengeStreak';
import { StreakTrackingEvent } from '@streakoid/streakoid-models/lib/Models/StreakTrackingEvent';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import { createStreakTrackingEvent } from '../../helpers/createStreakTrackingEvent';
import { userModel } from '../../Models/User';

export const trackMaintainedChallengeStreaks = async (
    maintainedChallengeStreaks: ChallengeStreak[],
): Promise<StreakTrackingEvent[]> => {
    return Promise.all(
        maintainedChallengeStreaks.map(async challengeStreak => {
            await challengeStreakModel.findByIdAndUpdate(challengeStreak._id, { $set: { completedToday: false } });
            const user = await userModel.findById(challengeStreak.userId);
            if (user) {
                if (user.longestEverStreak.numberOfDays < challengeStreak.currentStreak.numberOfDaysInARow) {
                    await userModel.findByIdAndUpdate(user._id, {
                        $set: {
                            longestEverStreak: {
                                challengeStreakId: challengeStreak._id,
                                challengeId: challengeStreak.challengeId,
                                challengeName: challengeStreak.challengeName,
                                numberOfDays: challengeStreak.currentStreak.numberOfDaysInARow,
                                startDate: challengeStreak.currentStreak.startDate,
                            },
                        },
                    });
                }

                if (user.longestCurrentStreak.numberOfDays < challengeStreak.currentStreak.numberOfDaysInARow) {
                    await userModel.findByIdAndUpdate(user._id, {
                        $set: {
                            longestCurrentStreak: {
                                challengeStreakId: challengeStreak._id,
                                challengeId: challengeStreak.challengeId,
                                challengeName: challengeStreak.challengeName,
                                numberOfDays: challengeStreak.currentStreak.numberOfDaysInARow,
                                startDate: challengeStreak.currentStreak.startDate,
                            },
                        },
                    });
                }
            }
            return createStreakTrackingEvent({
                type: StreakTrackingEventTypes.maintainedStreak,
                streakId: challengeStreak._id,
                userId: challengeStreak.userId,
                streakType: StreakTypes.challenge,
            });
        }),
    );
};
