import streakoid from '../../streakoid';
import { soloStreakModel } from '../../../src/Models/SoloStreak';
import { SoloStreak } from '@streakoid/streakoid-models/lib/Models/SoloStreak';
import { StreakTrackingEvent } from '@streakoid/streakoid-models/lib/Models/StreakTrackingEvent';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';

export const trackMaintainedSoloStreaks = async (
    maintainedSoloStreaks: SoloStreak[],
): Promise<StreakTrackingEvent[]> => {
    return Promise.all(
        maintainedSoloStreaks.map(async soloStreak => {
            await soloStreakModel.findByIdAndUpdate(soloStreak._id, { $set: { completedToday: false } });
            return streakoid.streakTrackingEvents.create({
                type: StreakTrackingEventTypes.maintainedStreak,
                streakId: soloStreak._id,
                userId: soloStreak.userId,
                streakType: StreakTypes.solo,
            });
        }),
    );
};
