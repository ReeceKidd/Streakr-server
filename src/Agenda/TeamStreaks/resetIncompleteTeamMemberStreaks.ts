import streakoid from '../../streakoid';
import {
    GroupMemberStreak,
    CurrentStreak,
    PastStreak,
    StreakTrackingEvent,
    StreakTrackingEventTypes,
    StreakTypes,
} from '@streakoid/streakoid-sdk/lib';

export const resetIncompleteTeamMemberStreaks = async (
    incompleteGroupMemberStreaks: GroupMemberStreak[],
    endDate: string,
): Promise<StreakTrackingEvent[]> => {
    return Promise.all(
        incompleteGroupMemberStreaks.map(async groupMemberStreak => {
            const pastStreak: PastStreak = {
                endDate: endDate,
                startDate: groupMemberStreak.currentStreak.startDate || endDate,
                numberOfDaysInARow: groupMemberStreak.currentStreak.numberOfDaysInARow,
            };

            const pastStreaks: PastStreak[] = [...groupMemberStreak.pastStreaks, pastStreak];

            const currentStreak: CurrentStreak = {
                startDate: '',
                numberOfDaysInARow: 0,
            };

            await streakoid.groupMemberStreaks.update({
                groupMemberStreakId: groupMemberStreak._id,
                updateData: {
                    currentStreak,
                    pastStreaks,
                    active: false,
                },
            });

            await streakoid.teamStreaks.update({
                teamStreakId: groupMemberStreak.teamStreakId,
                updateData: {
                    completedToday: false,
                    active: false,
                },
            });

            return streakoid.streakTrackingEvents.create({
                type: StreakTrackingEventTypes.lostStreak,
                streakId: groupMemberStreak._id,
                userId: groupMemberStreak.userId,
                streakType: StreakTypes.teamMember,
            });
        }),
    );
};
