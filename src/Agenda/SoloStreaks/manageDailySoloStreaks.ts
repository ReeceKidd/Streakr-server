import moment from 'moment-timezone';

import { trackMaintainedSoloStreaks } from './trackMaintainedSoloStreaks';
import { trackInactiveSoloStreaks } from './trackInactiveSoloStreaks';
import { resetIncompleteSoloStreaks } from './resetIncompleteSoloStreaks';
import { soloStreakModel } from '../../../src/Models/SoloStreak';
import { DailyJob } from '@streakoid/streakoid-models/lib/Models/DailyJob';
import { SoloStreak } from '@streakoid/streakoid-models/lib/Models/SoloStreak';
import AgendaJobNames from '@streakoid/streakoid-models/lib/Types/AgendaJobNames';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import { createDailyJob } from '../../helpers/createDailyJob';

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

    return createDailyJob({
        agendaJobId: String(agendaJobId),
        jobName: AgendaJobNames.soloStreakDailyTracker,
        timezone,
        localisedJobCompleteTime,
        streakType: StreakTypes.solo,
    });
};
