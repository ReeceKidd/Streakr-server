import streakoid from '../../streakoid';
import { teamStreakModel } from '../../../src/Models/TeamStreak';
import { PopulatedTeamStreak } from '@streakoid/streakoid-models/lib/Models/PopulatedTeamStreak';
import { StreakTrackingEvent } from '@streakoid/streakoid-models/lib/Models/StreakTrackingEvent';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';

export const trackMaintainedTeamStreaks = async (
    maintainedTeamStreaks: PopulatedTeamStreak[],
): Promise<StreakTrackingEvent[]> => {
    return Promise.all(
        maintainedTeamStreaks.map(async teamStreak => {
            await teamStreakModel.findByIdAndUpdate(teamStreak._id, { $set: { completedToday: false } });
            return streakoid.streakTrackingEvents.create({
                type: StreakTrackingEventTypes.maintainedStreak,
                streakId: teamStreak._id,
                streakType: StreakTypes.team,
            });
        }),
    );
};
