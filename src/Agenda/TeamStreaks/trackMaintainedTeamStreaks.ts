import { teamStreakModel } from '../../../src/Models/TeamStreak';
import { StreakTrackingEvent } from '@streakoid/streakoid-models/lib/Models/StreakTrackingEvent';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import { createStreakTrackingEvent } from '../../helpers/createStreakTrackingEvent';
import { TeamStreak } from '@streakoid/streakoid-models/lib/Models/TeamStreak';
import { userModel } from '../../Models/User';
import { LongestEverTeamStreak } from '@streakoid/streakoid-models/lib/Models/LongestEverTeamStreak';
import { achievementModel } from '../../Models/Achievement';
import AchievementTypes from '@streakoid/streakoid-models/lib/Types/AchievementTypes';

export const trackMaintainedTeamStreaks = async (
    maintainedTeamStreaks: TeamStreak[],
): Promise<StreakTrackingEvent[]> => {
    return Promise.all(
        maintainedTeamStreaks.map(async teamStreak => {
            if (teamStreak.longestTeamStreak.numberOfDays < teamStreak.currentStreak.numberOfDaysInARow) {
                const longestTeamStreak: LongestEverTeamStreak = {
                    teamStreakId: teamStreak._id,
                    teamStreakName: teamStreak.streakName,
                    numberOfDays: teamStreak.currentStreak.numberOfDaysInARow,
                    startDate: teamStreak.currentStreak.startDate || new Date().toString(),
                    members: teamStreak.members,
                    streakType: StreakTypes.team,
                };
                await teamStreakModel.findByIdAndUpdate(teamStreak._id, {
                    $set: { longestTeamStreak },
                });
            }

            await Promise.all(
                teamStreak.members.map(async member => {
                    const populatedMember = await userModel.findById(member.memberId);
                    if (populatedMember) {
                        if (
                            populatedMember.longestEverStreak &&
                            populatedMember.longestEverStreak.numberOfDays < teamStreak.currentStreak.numberOfDaysInARow
                        ) {
                            const longestTeamStreak: LongestEverTeamStreak = {
                                teamStreakId: teamStreak._id,
                                teamStreakName: teamStreak.streakName,
                                numberOfDays: teamStreak.currentStreak.numberOfDaysInARow,
                                startDate: teamStreak.currentStreak.startDate || new Date().toString(),
                                members: teamStreak.members,
                                streakType: StreakTypes.team,
                            };
                            await userModel.findByIdAndUpdate(member.memberId, {
                                $set: { longestEverStreak: longestTeamStreak },
                            });
                        }

                        if (
                            populatedMember.longestTeamStreak &&
                            populatedMember.longestTeamStreak.numberOfDays < teamStreak.currentStreak.numberOfDaysInARow
                        ) {
                            const longestTeamStreak: LongestEverTeamStreak = {
                                teamStreakId: teamStreak._id,
                                teamStreakName: teamStreak.streakName,
                                numberOfDays: teamStreak.currentStreak.numberOfDaysInARow,
                                startDate: teamStreak.currentStreak.startDate || new Date().toString(),
                                members: teamStreak.members,
                                streakType: StreakTypes.team,
                            };
                            await userModel.findByIdAndUpdate(member.memberId, { $set: { longestTeamStreak } });
                        }
                    }

                    return member;
                }),
            );

            const oneHundredDays = 100;
            if (teamStreak.currentStreak.numberOfDaysInARow === oneHundredDays) {
                await Promise.all(
                    teamStreak.members.map(async member => {
                        const oneHundredDayTeamStreakAchievement = await achievementModel.findOne({
                            achievementType: AchievementTypes.oneHundredDayTeamStreak,
                        });
                        const populatedMember = await userModel.findById(member.memberId);
                        if (populatedMember && oneHundredDayTeamStreakAchievement) {
                            await userModel.findByIdAndUpdate(populatedMember._id, {
                                $addToSet: { achievements: oneHundredDayTeamStreakAchievement },
                            });
                        }
                        return member;
                    }),
                );
            }

            await teamStreakModel.findByIdAndUpdate(teamStreak._id, {
                $set: { completedToday: false },
            });

            return createStreakTrackingEvent({
                type: StreakTrackingEventTypes.maintainedStreak,
                streakId: teamStreak._id,
                streakType: StreakTypes.team,
            });
        }),
    );
};
