import { teamStreakModel } from '../../../src/Models/TeamStreak';
import { StreakTrackingEvent } from '@streakoid/streakoid-models/lib/Models/StreakTrackingEvent';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import { createStreakTrackingEvent } from '../../helpers/createStreakTrackingEvent';
import { TeamStreak } from '@streakoid/streakoid-models/lib/Models/TeamStreak';

export const trackMaintainedTeamStreaks = async (
    maintainedTeamStreaks: TeamStreak[],
): Promise<StreakTrackingEvent[]> => {
    return Promise.all(
        maintainedTeamStreaks.map(async teamStreak => {
            await teamStreakModel.findByIdAndUpdate(teamStreak._id, { $set: { completedToday: false } });
            return createStreakTrackingEvent({
                type: StreakTrackingEventTypes.maintainedStreak,
                streakId: teamStreak._id,
                streakType: StreakTypes.team,
            });
        }),
    );
};
