import { teamStreakModel } from '../../../src/Models/TeamStreak';
import { StreakTrackingEvent } from '@streakoid/streakoid-models/lib/Models/StreakTrackingEvent';
import { PastStreak } from '@streakoid/streakoid-models/lib/Models/PastStreak';
import { CurrentStreak } from '@streakoid/streakoid-models/lib/Models/CurrentStreak';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import { createStreakTrackingEvent } from '../../helpers/createStreakTrackingEvent';
import { TeamStreak } from '@streakoid/streakoid-models/lib/Models/TeamStreak';
import { userModel } from '../../Models/User';

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

            const users = await userModel.find({ _id: teamStreak.members.map(member => member.memberId) });

            await Promise.all(
                users.map(user => {
                    const longestTeamStreak = user && user.longestTeamStreak;

                    if (
                        longestTeamStreak &&
                        longestTeamStreak.streakType === StreakTypes.team &&
                        longestTeamStreak.teamStreakId &&
                        longestTeamStreak.teamStreakId === teamStreak._id &&
                        user
                    ) {
                        return userModel.findByIdAndUpdate(user._id, {
                            $set: { longestTeamStreak: { ...longestTeamStreak, endDate } },
                        });
                    }
                    return;
                }),
            );

            return createStreakTrackingEvent({
                type: StreakTrackingEventTypes.lostStreak,
                streakId: teamStreak._id,
                streakType: StreakTypes.team,
            });
        }),
    );
};
