import streakoid from '../../streakoid';
import {
    GroupMemberStreak,
    CurrentStreak,
    PastStreak,
    StreakTrackingEvent,
    StreakTrackingEventTypes,
    StreakTypes,
    TeamStreakStatus,
} from '@streakoid/streakoid-sdk/lib';

export const resetIncompleteGroupMemberStreaks = async (
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
                    teamStreakStatus: TeamStreakStatus.failed,
                },
            });

            return streakoid.streakTrackingEvents.create({
                type: StreakTrackingEventTypes.lostStreak,
                streakId: groupMemberStreak.teamStreakId,
                userId: groupMemberStreak.userId,
                streakType: StreakTypes.team,
            });
        }),
    );
};
