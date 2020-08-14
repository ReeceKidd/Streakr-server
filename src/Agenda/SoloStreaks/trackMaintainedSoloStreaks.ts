import { soloStreakModel } from '../../../src/Models/SoloStreak';
import { SoloStreak } from '@streakoid/streakoid-models/lib/Models/SoloStreak';
import { StreakTrackingEvent } from '@streakoid/streakoid-models/lib/Models/StreakTrackingEvent';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import { createStreakTrackingEvent } from '../../helpers/createStreakTrackingEvent';
import { userModel } from '../../Models/User';
import { LongestEverSoloStreak } from '@streakoid/streakoid-models/lib/Models/LongestEverSoloStreak';
import { LongestCurrentStreak } from '@streakoid/streakoid-models/lib/Models/LongestCurrentStreak';

export const trackMaintainedSoloStreaks = async (
    maintainedSoloStreaks: SoloStreak[],
): Promise<StreakTrackingEvent[]> => {
    return Promise.all(
        maintainedSoloStreaks.map(async soloStreak => {
            await soloStreakModel.findByIdAndUpdate(soloStreak._id, { $set: { completedToday: false } });
            const user = await userModel.findById(soloStreak.userId);
            if (user) {
                if (user.longestEverStreak.numberOfDays < soloStreak.currentStreak.numberOfDaysInARow) {
                    const longestEverStreak: LongestEverSoloStreak = {
                        soloStreakId: soloStreak._id,
                        soloStreakName: soloStreak.streakName,
                        numberOfDays: soloStreak.currentStreak.numberOfDaysInARow,
                        startDate: soloStreak.currentStreak.startDate || new Date().toString(),
                        streakType: StreakTypes.solo,
                    };
                    await userModel.findByIdAndUpdate(user._id, {
                        $set: {
                            longestEverStreak,
                        },
                    });
                }

                if (user.longestCurrentStreak.numberOfDays < soloStreak.currentStreak.numberOfDaysInARow) {
                    const longestCurrentStreak: LongestCurrentStreak = {
                        soloStreakId: soloStreak._id,
                        soloStreakName: soloStreak.streakName,
                        numberOfDays: soloStreak.currentStreak.numberOfDaysInARow,
                        startDate: soloStreak.currentStreak.startDate || new Date().toString(),
                        streakType: StreakTypes.solo,
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
                streakId: soloStreak._id,
                userId: soloStreak.userId,
                streakType: StreakTypes.solo,
            });
        }),
    );
};
