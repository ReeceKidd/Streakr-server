import { StreakTrackingEvent } from '@streakoid/streakoid-models/lib/Models/StreakTrackingEvent';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import { createStreakTrackingEvent } from '../../helpers/createStreakTrackingEvent';
import { PopulatedTeamStreak } from '@streakoid/streakoid-models/lib/Models/PopulatedTeamStreak';

export const trackInactiveTeamStreaks = async (
    inactiveTeamStreaks: PopulatedTeamStreak[],
): Promise<StreakTrackingEvent[]> => {
    return Promise.all(
        inactiveTeamStreaks.map(async teamStreak => {
            return createStreakTrackingEvent({
                type: StreakTrackingEventTypes.inactiveStreak,
                streakId: teamStreak._id,
                streakType: StreakTypes.team,
            });
        }),
    );
};
