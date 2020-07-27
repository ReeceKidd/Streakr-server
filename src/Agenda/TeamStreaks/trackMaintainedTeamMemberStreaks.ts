import { teamMemberStreakModel } from '../../../src/Models/TeamMemberStreak';
import { TeamMemberStreak } from '@streakoid/streakoid-models/lib/Models/TeamMemberStreak';
import { StreakTrackingEvent } from '@streakoid/streakoid-models/lib/Models/StreakTrackingEvent';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import { createStreakTrackingEvent } from '../../helpers/createStreakTrackingEvent';
import { userModel } from '../../Models/User';
import { teamStreakModel } from '../../Models/TeamStreak';

export const trackMaintainedTeamMemberStreaks = async (
    maintainedTeamMemberStreaks: TeamMemberStreak[],
): Promise<StreakTrackingEvent[]> => {
    return Promise.all(
        maintainedTeamMemberStreaks.map(async teamMemberStreak => {
            await teamMemberStreakModel.findByIdAndUpdate(teamMemberStreak._id, { $set: { completedToday: false } });
            const user = await userModel.findById(teamMemberStreak.userId);
            if (user) {
                if (user.longestEverStreak.numberOfDays < teamMemberStreak.currentStreak.numberOfDaysInARow) {
                    const teamStreak = await teamStreakModel.findById(teamMemberStreak.teamStreakId);
                    await userModel.findByIdAndUpdate(user._id, {
                        $set: {
                            longestEverStreak: {
                                teamMemberStreakId: teamMemberStreak._id,
                                teamStreakId: teamMemberStreak.teamStreakId,
                                teamStreakName: teamStreak && teamStreak.streakName,
                                numberOfDays: teamMemberStreak.currentStreak.numberOfDaysInARow,
                                startDate: teamMemberStreak.currentStreak.startDate,
                            },
                        },
                    });
                }
            }
            return createStreakTrackingEvent({
                type: StreakTrackingEventTypes.maintainedStreak,
                streakId: teamMemberStreak._id,
                userId: teamMemberStreak.userId,
                streakType: StreakTypes.teamMember,
            });
        }),
    );
};
