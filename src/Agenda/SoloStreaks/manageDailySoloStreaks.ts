import moment from 'moment-timezone';
import mongoose from 'mongoose';
import { AgendaJobNames, StreakTypes, DailyJob, SoloStreak } from '@streakoid/streakoid-sdk/lib';

import { trackMaintainedSoloStreaks } from './trackMaintainedSoloStreaks';
import { trackInactiveSoloStreaks } from './trackInactiveSoloStreaks';
import { resetIncompleteSoloStreaks } from './resetIncompleteSoloStreaks';
import streakoid from '../../streakoid';
import { soloStreakModel } from '../../../src/Models/SoloStreak';
import { getServiceConfig } from '../../../src/getServiceConfig';

const { DATABASE_URI } = getServiceConfig();

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

    mongoose
        .connect(DATABASE_URI, { useNewUrlParser: true, useFindAndModify: false })
        .catch(err => console.log(err.message));

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

    mongoose.connection.close();

    return streakoid.dailyJobs.create({
        agendaJobId: String(agendaJobId),
        jobName: AgendaJobNames.soloStreakDailyTracker,
        timezone,
        localisedJobCompleteTime,
        streakType: StreakTypes.solo,
    });
};
