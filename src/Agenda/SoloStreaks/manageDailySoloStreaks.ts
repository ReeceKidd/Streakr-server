import moment from 'moment-timezone';
import { AgendaJobNames, StreakTypes, DailyJob, SoloStreak } from '@streakoid/streakoid-models/lib';

import { trackMaintainedSoloStreaks } from './trackMaintainedSoloStreaks';
import { trackInactiveSoloStreaks } from './trackInactiveSoloStreaks';
import { resetIncompleteSoloStreaks } from './resetIncompleteSoloStreaks';
import streakoid from '../../streakoid';
import { soloStreakModel } from '../../../src/Models/SoloStreak';

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

    const maintainedSoloStreaks: SoloStreak[] = await soloStreakModel.find({
        completedToday: true,
        active: true,
        timezone,
    });

    const inactiveSoloStreaks: SoloStreak[] = await soloStreakModel.find({
        completedToday: false,
        active: false,
        timezone,
    });

    const incompleteSoloStreaks: SoloStreak[] = await soloStreakModel.find({
        completedToday: false,
        active: true,
        timezone: timezone,
    });

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
