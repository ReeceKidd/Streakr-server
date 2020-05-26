import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import AgendaJobNames from '@streakoid/streakoid-models/lib/Types/AgendaJobNames';
import { dailyJobModel } from '../Models/DailyJob';
import { DailyJob } from '@streakoid/streakoid-models/lib/Models/DailyJob';

export const createDailyJob = ({
    agendaJobId,
    jobName,
    timezone,
    localisedJobCompleteTime,
    streakType,
}: {
    agendaJobId: string;
    jobName: AgendaJobNames;
    timezone: string;
    localisedJobCompleteTime: string;
    streakType: StreakTypes;
}): Promise<DailyJob> => {
    const newDailyJob = new dailyJobModel({
        agendaJobId,
        jobName,
        timezone,
        localisedJobCompleteTime,
        streakType,
    });
    return newDailyJob.save();
};
