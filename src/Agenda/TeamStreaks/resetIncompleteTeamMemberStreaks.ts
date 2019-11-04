import {
    TeamMemberStreak,
    CurrentStreak,
    PastStreak,
    StreakTrackingEvent,
    StreakTrackingEventTypes,
    StreakTypes,
} from '@streakoid/streakoid-sdk/lib';
import streakoid from '../../streakoid';
import { teamMemberStreakModel } from '../../../src/Models/TeamMemberStreak';
import { teamStreakModel } from '../../../src/Models/TeamStreak';

export const resetIncompleteTeamMemberStreaks = async (
    incompleteTeamMemberStreaks: TeamMemberStreak[],
    endDate: string,
): Promise<StreakTrackingEvent[]> => {
    return Promise.all(
        incompleteTeamMemberStreaks.map(async teamMemberStreak => {
            const pastStreak: PastStreak = {
                endDate: endDate,
                startDate: teamMemberStreak.currentStreak.startDate || endDate,
                numberOfDaysInARow: teamMemberStreak.currentStreak.numberOfDaysInARow,
            };

            const pastStreaks: PastStreak[] = [...teamMemberStreak.pastStreaks, pastStreak];

            const currentStreak: CurrentStreak = {
                startDate: '',
                numberOfDaysInARow: 0,
            };

            await teamMemberStreakModel.findByIdAndUpdate(teamMemberStreak._id, {
                $set: {
                    currentStreak,
                    pastStreaks,
                    active: false,
                },
            });

            await teamStreakModel.findByIdAndUpdate(teamMemberStreak.teamStreakId, {
                $set: {
                    completedToday: false,
                },
            });

            return streakoid.streakTrackingEvents.create({
                type: StreakTrackingEventTypes.lostStreak,
                streakId: teamMemberStreak._id,
                userId: teamMemberStreak.userId,
                streakType: StreakTypes.teamMember,
            });
        }),
    );
};
