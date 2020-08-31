import { challengeStreakModel } from '../../../src/Models/ChallengeStreak';
import { ChallengeStreak } from '@streakoid/streakoid-models/lib/Models/ChallengeStreak';
import { StreakTrackingEvent } from '@streakoid/streakoid-models/lib/Models/StreakTrackingEvent';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import { createStreakTrackingEvent } from '../../helpers/createStreakTrackingEvent';
import { userModel } from '../../Models/User';
import { LongestEverChallengeStreak } from '@streakoid/streakoid-models/lib/Models/LongestEverChallengeStreak';
import { LongestCurrentChallengeStreak } from '@streakoid/streakoid-models/lib/Models/LongestCurrentChallengeStreak';

export const trackMaintainedChallengeStreaks = async (
    maintainedChallengeStreaks: ChallengeStreak[],
): Promise<StreakTrackingEvent[]> => {
    return Promise.all(
        maintainedChallengeStreaks.map(async challengeStreak => {
            await challengeStreakModel.findByIdAndUpdate(challengeStreak._id, { $set: { completedToday: false } });
            if (
                challengeStreak.longestChallengeStreak.numberOfDays < challengeStreak.currentStreak.numberOfDaysInARow
            ) {
                const longestChallengeStreak: LongestEverChallengeStreak = {
                    challengeStreakId: challengeStreak._id,
                    challengeId: challengeStreak.challengeId,
                    challengeName: challengeStreak.challengeName,
                    numberOfDays: challengeStreak.currentStreak.numberOfDaysInARow,
                    startDate: challengeStreak.currentStreak.startDate || new Date().toString(),
                    streakType: StreakTypes.challenge,
                };
                await challengeStreakModel.findByIdAndUpdate(challengeStreak._id, {
                    $set: {
                        longestChallengeStreak,
                    },
                });
            }
            const user = await userModel.findById(challengeStreak.userId);
            if (user) {
                if (user.longestEverStreak.numberOfDays < challengeStreak.currentStreak.numberOfDaysInARow) {
                    const longestEverStreak: LongestEverChallengeStreak = {
                        challengeStreakId: challengeStreak._id,
                        challengeId: challengeStreak.challengeId,
                        challengeName: challengeStreak.challengeName,
                        numberOfDays: challengeStreak.currentStreak.numberOfDaysInARow,
                        startDate: challengeStreak.currentStreak.startDate || new Date().toString(),
                        streakType: StreakTypes.challenge,
                    };
                    await userModel.findByIdAndUpdate(user._id, {
                        $set: {
                            longestEverStreak,
                        },
                    });
                }

                if (user.longestCurrentStreak.numberOfDays < challengeStreak.currentStreak.numberOfDaysInARow) {
                    const longestCurrentStreak: LongestCurrentChallengeStreak = {
                        challengeStreakId: challengeStreak._id,
                        challengeId: challengeStreak.challengeId,
                        challengeName: challengeStreak.challengeName,
                        numberOfDays: challengeStreak.currentStreak.numberOfDaysInARow,
                        startDate: challengeStreak.currentStreak.startDate || new Date().toString(),
                        streakType: StreakTypes.challenge,
                    };
                    await userModel.findByIdAndUpdate(user._id, {
                        $set: {
                            longestCurrentStreak,
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
