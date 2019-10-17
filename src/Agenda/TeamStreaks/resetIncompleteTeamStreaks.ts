import streakoid from '../../streakoid';
import {
    CurrentStreak,
    PastStreak,
    StreakTrackingEvent,
    StreakTrackingEventTypes,
    StreakTypes,
    PopulatedTeamStreak,
} from '@streakoid/streakoid-sdk/lib';

export const resetIncompleteTeamStreaks = async (
    incompleteTeamStreaks: PopulatedTeamStreak[],
    endDate: string,
): Promise<StreakTrackingEvent[]> => {
    return Promise.all(
        incompleteTeamStreaks.map(async teamStreak => {
            const pastStreak: PastStreak = {
                endDate: endDate,
                startDate: teamStreak.currentStreak.startDate || endDate,
                numberOfDaysInARow: teamStreak.currentStreak.numberOfDaysInARow,
            };

            const pastStreaks: PastStreak[] = [...teamStreak.pastStreaks, pastStreak];

            const currentStreak: CurrentStreak = {
                startDate: '',
                numberOfDaysInARow: 0,
            };

            await streakoid.teamStreaks.update({
                teamStreakId: teamStreak._id,
                updateData: {
                    currentStreak,
                    pastStreaks,
                    active: false,
                },
            });

            await Promise.all(
                teamStreak.members.map(async member => {
                    const pastStreaks: PastStreak[] = [...teamStreak.pastStreaks, pastStreak];
                    await streakoid.teamMemberStreaks.update({
                        teamMemberStreakId: member.teamMemberStreak._id,
                        updateData: {
                            currentStreak,
                            pastStreaks,
                            active: false,
                        },
                    });
                    return streakoid.streakTrackingEvents.create({
                        type: StreakTrackingEventTypes.forcedToLoseStreakBecauseTeamMemberDidNotCompleteTask,
                        streakId: member.teamMemberStreak._id,
                        streakType: StreakTypes.teamMember,
                        userId: member._id,
                    });
                }),
            );

            return streakoid.streakTrackingEvents.create({
                type: StreakTrackingEventTypes.lostStreak,
                streakId: teamStreak._id,
                streakType: StreakTypes.team,
            });
        }),
    );
};
