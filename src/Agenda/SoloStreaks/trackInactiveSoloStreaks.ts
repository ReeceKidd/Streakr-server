import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import { SoloStreak } from '@streakoid/streakoid-models/lib/Models/SoloStreak';
import { StreakTrackingEvent } from '@streakoid/streakoid-models/lib/Models/StreakTrackingEvent';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import { createStreakTrackingEvent } from '../../helpers/createStreakTrackingEvent';

export const trackInactiveSoloStreaks = async (inactiveSoloStreaks: SoloStreak[]): Promise<StreakTrackingEvent[]> => {
    return Promise.all(
        inactiveSoloStreaks.map(async soloStreak => {
            return createStreakTrackingEvent({
                type: StreakTrackingEventTypes.inactiveStreak,
                streakId: soloStreak._id,
                userId: soloStreak.userId,
                streakType: StreakTypes.solo,
            });
        }),
    );
};
