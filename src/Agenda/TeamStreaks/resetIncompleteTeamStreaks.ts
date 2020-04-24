import streakoid from '../../streakoid';
import {
    CurrentStreak,
    PastStreak,
    StreakTrackingEvent,
    StreakTrackingEventTypes,
    StreakTypes,
    PopulatedTeamStreak,
} from '@streakoid/streakoid-models/lib';
import { teamStreakModel } from '../../../src/Models/TeamStreak';

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

            await teamStreakModel.findByIdAndUpdate(teamStreak._id, {
                $set: {
                    currentStreak,
                    pastStreaks,
                    active: false,
                },
            });

            return streakoid.streakTrackingEvents.create({
                type: StreakTrackingEventTypes.lostStreak,
                streakId: teamStreak._id,
                streakType: StreakTypes.team,
            });
        }),
    );
};
