/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { agendaJobModel } from '../../../src/Models/AgendaJob';
import moment from 'moment-timezone';
import { AgendaTimeRanges } from '../agenda';
import AgendaJobNames from '@streakoid/streakoid-models/lib/Types/AgendaJobNames';

export const adjustStreakDailyTrackerForDaylightSavingsTime = async ({
    timezone,
    agendaJobName,
}: {
    timezone: string;
    agendaJobName: AgendaJobNames;
}) => {
    const streakDailyTrackerJob = await agendaJobModel.findOne({
        name: agendaJobName,
        'data.timezone': timezone,
    });

    if (!streakDailyTrackerJob) {
        throw new Error(`No ${agendaJobName} found`);
    }

    const nextRunAtTime = moment.tz(new Date(streakDailyTrackerJob.nextRunAt), timezone);
    const endOfDay = moment.tz(timezone).endOf(AgendaTimeRanges.day);
    if (!nextRunAtTime.isSame(endOfDay)) {
        return agendaJobModel.findByIdAndUpdate(streakDailyTrackerJob._id, {
            $set: {
                nextRunAt: endOfDay.toDate(),
            },
        });
    }
    return true;
};
