/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { agendaJobModel } from '../../../src/Models/AgendaJob';
import moment from 'moment';
import { AgendaTimeRanges } from '../agenda';
import { AgendaJob, AgendaJobNames } from '@streakoid/streakoid-sdk/lib';

export const adjustForDaylightSavingsTime = async (timezone: string) => {
    const soloStreakDailyTrackerJob: AgendaJob = await agendaJobModel
        .findOne({ name: AgendaJobNames.soloStreakDailyTracker, 'data.timezone': timezone })
        .lean();

    const teamStreakDailyTrackerJob = await agendaJobModel
        .findOne({ name: AgendaJobNames.teamStreakDailyTracker, 'data.timezone': timezone })
        .lean();

    const nextRunAtTime = moment.tz(new Date(soloStreakDailyTrackerJob.nextRunAt), timezone);
    const endOfDay = moment.tz(timezone).endOf(AgendaTimeRanges.day);
    if (!nextRunAtTime.isSame(endOfDay)) {
        return Promise.all([
            agendaJobModel.findByIdAndUpdate(soloStreakDailyTrackerJob._id, {
                $set: {
                    nextRunAt: endOfDay.toDate(),
                },
            }),
            agendaJobModel.findByIdAndUpdate(teamStreakDailyTrackerJob._id, {
                $set: {
                    nextRunAt: endOfDay.toDate(),
                },
            }),
        ]);
    }
};
