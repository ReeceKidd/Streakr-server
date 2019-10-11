import streakoid from '../../streakoid';
import {
    GroupMemberStreak,
    CurrentStreak,
    Activtiy,
    PastStreakArray,
    PastStreak,
    StreakTrackingEvent,
} from '@streakoid/streakoid-sdk/lib';
import StreakTrackingEventType from '@streakoid/streakoid-sdk/lib/streakTrackingEventType';

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

            const pastStreaks: PastStreakArray = [...groupMemberStreak.pastStreaks, pastStreak];

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

            return streakoid.streakTrackingEvents.create({
                type: StreakTrackingEventType.LostStreak,
                streakId: groupMemberStreak._id,
                userId: groupMemberStreak.userId,
            });
        }),
    );
};
