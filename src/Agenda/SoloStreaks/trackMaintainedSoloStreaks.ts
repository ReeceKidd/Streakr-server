import streakoid from '../../streakoid';
import {
    SoloStreak,
    StreakTrackingEvent,
    StreakTrackingEventTypes,
    StreakTypes,
} from '@streakoid/streakoid-models/lib';
import { soloStreakModel } from '../../../src/Models/SoloStreak';

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
