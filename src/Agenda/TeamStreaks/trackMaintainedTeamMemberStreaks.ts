import streakoid from '../../streakoid';
import { teamMemberStreakModel } from '../../../src/Models/TeamMemberStreak';
import { TeamMemberStreak } from '@streakoid/streakoid-models/lib/Models/TeamMemberStreak';
import { StreakTrackingEvent } from '@streakoid/streakoid-models/lib/Models/StreakTrackingEvent';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';

export const trackMaintainedTeamMemberStreaks = async (
    maintainedTeamMemberStreaks: TeamMemberStreak[],
): Promise<StreakTrackingEvent[]> => {
    return Promise.all(
        maintainedTeamMemberStreaks.map(async teamMemberStreak => {
            await teamMemberStreakModel.findByIdAndUpdate(teamMemberStreak._id, { $set: { completedToday: false } });
            return streakoid.streakTrackingEvents.create({
                type: StreakTrackingEventTypes.maintainedStreak,
                streakId: teamMemberStreak._id,
                userId: teamMemberStreak.userId,
                streakType: StreakTypes.teamMember,
            });
        }),
    );
};
