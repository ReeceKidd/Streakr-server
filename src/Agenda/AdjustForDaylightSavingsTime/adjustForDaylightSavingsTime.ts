/* eslint-disable @typescript-eslint/explicit-function-return-type */
import AgendaJobNames from '@streakoid/streakoid-models/lib/Types/AgendaJobNames';
import { adjustStreakDailyTrackerForDaylightSavingsTime } from './adjustStreakDailyTrackerForDaylightSavingsTime';

export const adjustForDaylightSavingsTime = async ({ timezone }: { timezone: string }) => {
    return Promise.all([
        adjustStreakDailyTrackerForDaylightSavingsTime({
            timezone,
            agendaJobName: AgendaJobNames.soloStreakDailyTracker,
        }),
        adjustStreakDailyTrackerForDaylightSavingsTime({
            timezone,
            agendaJobName: AgendaJobNames.teamStreakDailyTracker,
        }),
        adjustStreakDailyTrackerForDaylightSavingsTime({
            timezone,
            agendaJobName: AgendaJobNames.challengeStreakDailyTracker,
        }),
    ]);
};
