import { teamStreakModel } from '../../../src/Models/TeamStreak';
import { StreakTrackingEvent } from '@streakoid/streakoid-models/lib/Models/StreakTrackingEvent';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import { createStreakTrackingEvent } from '../../helpers/createStreakTrackingEvent';
import { TeamStreak } from '@streakoid/streakoid-models/lib/Models/TeamStreak';
import { LongestTeamStreak } from '@streakoid/streakoid-models/lib/Models/LongestTeamStreak';
import { userModel } from '../../Models/User';

export const trackMaintainedTeamStreaks = async (
    maintainedTeamStreaks: TeamStreak[],
): Promise<StreakTrackingEvent[]> => {
    return Promise.all(
        maintainedTeamStreaks.map(async teamStreak => {
            if (teamStreak.currentStreak.numberOfDaysInARow > teamStreak.longestTeamStreak.numberOfDays) {
                const startDate = teamStreak.currentStreak.startDate
                    ? new Date(teamStreak.currentStreak.startDate)
                    : new Date();
                const longestTeamStreak: LongestTeamStreak = {
                    teamStreakId: teamStreak._id,
                    teamStreakName: teamStreak.streakName,
                    numberOfDays: teamStreak.currentStreak.numberOfDaysInARow,
                    startDate,
                    members: teamStreak.members,
                };
                await teamStreakModel.findByIdAndUpdate(teamStreak._id, {
                    $set: { longestTeamStreak, completedToday: false },
                });
                await Promise.all(
                    teamStreak.members.map(member => {
                        return userModel.findByIdAndUpdate(member.memberId, { $set: { longestTeamStreak } });
                    }),
                );
            } else {
                await teamStreakModel.findByIdAndUpdate(teamStreak._id, {
                    $set: { completedToday: false },
                });
            }

            return createStreakTrackingEvent({
                type: StreakTrackingEventTypes.maintainedStreak,
                streakId: teamStreak._id,
                streakType: StreakTypes.team,
            });
        }),
    );
};
