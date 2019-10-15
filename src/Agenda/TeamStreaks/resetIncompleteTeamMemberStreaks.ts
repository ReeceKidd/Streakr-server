import streakoid from '../../streakoid';
import {
    TeamMemberStreak,
    CurrentStreak,
    PastStreak,
    StreakTrackingEvent,
    StreakTrackingEventTypes,
    StreakTypes,
} from '@streakoid/streakoid-sdk/lib';

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

            await streakoid.teamMemberStreaks.update({
                teamMemberStreakId: teamMemberStreak._id,
                updateData: {
                    currentStreak,
                    pastStreaks,
                    active: false,
                },
            });

            await streakoid.teamStreaks.update({
                teamStreakId: teamMemberStreak.teamStreakId,
                updateData: {
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
