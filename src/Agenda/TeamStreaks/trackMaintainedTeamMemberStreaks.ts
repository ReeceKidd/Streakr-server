import {
    TeamMemberStreak,
    StreakTrackingEvent,
    StreakTrackingEventTypes,
    StreakTypes,
} from '@streakoid/streakoid-sdk/lib';

import streakoid from '../../streakoid';
import { teamMemberStreakModel } from '../../../src/Models/TeamMemberStreak';

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
