import {
    StreakTrackingEvent,
    StreakTrackingEventTypes,
    StreakTypes,
    PopulatedTeamStreak,
} from '@streakoid/streakoid-models/lib';

import streakoid from '../../streakoid';
import { teamStreakModel } from '../../../src/Models/TeamStreak';

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
