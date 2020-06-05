/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { agendaJobModel } from '../../Models/AgendaJob';
import moment from 'moment-timezone';
import { AgendaTimeRanges } from '../agenda';
import AgendaJobNames from '@streakoid/streakoid-models/lib/Types/AgendaJobNames';

export const adjustForDaylightSavingsTime = async ({ timezone }: { timezone: string }) => {
    const soloStreakDailyTrackerJob = await agendaJobModel.findOne({
        name: AgendaJobNames.soloStreakDailyTracker,
        'data.timezone': timezone,
    });

    if (!soloStreakDailyTrackerJob) {
        throw new Error(`No solo streak daily tracker job for timezone: ${timezone}`);
    }

    const teamStreakDailyTrackerJob = await agendaJobModel.findOne({
        name: AgendaJobNames.teamStreakDailyTracker,
        'data.timezone': timezone,
    });

    if (!teamStreakDailyTrackerJob) {
        throw new Error(`No team streak daily tracker job for timezone: ${timezone}`);
    }

    const challengeStreakDailyTrackerJob = await agendaJobModel.findOne({
        name: AgendaJobNames.challengeStreakDailyTracker,
        'data.timezone': timezone,
    });

    if (!challengeStreakDailyTrackerJob) {
        throw new Error(`No challenge streak daily tracker job for timezone: ${timezone}`);
    }

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
            agendaJobModel.findByIdAndUpdate(challengeStreakDailyTrackerJob._id, {
                $set: {
                    nextRunAt: endOfDay.toDate(),
                },
            }),
        ]);
    }
    return true;
};
