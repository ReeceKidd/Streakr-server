import moment from 'moment-timezone';

import { trackMaintainedSoloStreaks } from './trackMaintainedSoloStreaks';
import { trackInactiveSoloStreaks } from './trackInactiveSoloStreaks';
import { resetIncompleteSoloStreaks } from './resetIncompleteSoloStreaks';
import streakoid from '../../streakoid';
import { AgendaJobNames, StreakTypes, DailyJob } from '@streakoid/streakoid-sdk/lib';

export const manageDailySoloStreaks = async ({
    agendaJobId,
    timezone,
}: {
    agendaJobId: string;
    timezone: string;
}): Promise<DailyJob> => {
    const currentLocalTime = moment
        .tz(timezone)
        .toDate()
        .toString();

    const [maintainedSoloStreaks, inactiveSoloStreaks, incompleteSoloStreaks] = await Promise.all([
        streakoid.soloStreaks.getAll({
            completedToday: true,
            active: true,
            timezone,
        }),
        streakoid.soloStreaks.getAll({
            completedToday: false,
            active: false,
            timezone,
        }),
        streakoid.soloStreaks.getAll({
            completedToday: false,
            active: true,
            timezone: timezone,
        }),
    ]);

    await Promise.all([
        trackMaintainedSoloStreaks(maintainedSoloStreaks),
        trackInactiveSoloStreaks(inactiveSoloStreaks),
        resetIncompleteSoloStreaks(incompleteSoloStreaks, currentLocalTime),
    ]);

    const localisedJobCompleteTime = moment
        .tz(timezone)
        .toDate()
        .toString();

    return streakoid.dailyJobs.create({
        agendaJobId: String(agendaJobId),
        jobName: AgendaJobNames.soloStreakDailyTracker,
        timezone,
        localisedJobCompleteTime,
        streakType: StreakTypes.solo,
    });
};
