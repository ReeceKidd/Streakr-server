import { teamStreakModel } from '../../../src/Models/TeamStreak';
import { StreakTrackingEvent } from '@streakoid/streakoid-models/lib/Models/StreakTrackingEvent';
import { PastStreak } from '@streakoid/streakoid-models/lib/Models/PastStreak';
import { CurrentStreak } from '@streakoid/streakoid-models/lib/Models/CurrentStreak';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import { createStreakTrackingEvent } from '../../helpers/createStreakTrackingEvent';
import { TeamStreak } from '@streakoid/streakoid-models/lib/Models/TeamStreak';

export const resetIncompleteTeamStreaks = async (
    incompleteTeamStreaks: TeamStreak[],
    endDate: string,
): Promise<StreakTrackingEvent[]> => {
    return Promise.all(
        incompleteTeamStreaks.map(async teamStreak => {
            if (teamStreak.currentStreak.numberOfDaysInARow > 0) {
                const pastStreak: PastStreak = {
                    endDate: endDate,
                    startDate: teamStreak.currentStreak.startDate || endDate,
                    numberOfDaysInARow: teamStreak.currentStreak.numberOfDaysInARow,
                };

                const pastStreaks: PastStreak[] = [...teamStreak.pastStreaks, pastStreak];

                await teamStreakModel.findByIdAndUpdate(teamStreak._id, {
                    $set: {
                        pastStreaks,
                    },
                });
            }

            const currentStreak: CurrentStreak = {
                startDate: '',
                numberOfDaysInARow: 0,
            };

            await teamStreakModel.findByIdAndUpdate(teamStreak._id, {
                $set: {
                    active: false,
                    currentStreak,
                },
            });

            return createStreakTrackingEvent({
                type: StreakTrackingEventTypes.lostStreak,
                streakId: teamStreak._id,
                streakType: StreakTypes.team,
            });
        }),
    );
};
