import moment from 'moment';

import { agendaJobModel } from '../Models/AgendaJob';
import { agenda, AgendaTimeRanges, AgendaProcessTimes } from '../Agenda/agenda';
import Agenda from 'agenda';
import { AgendaJobNames } from '@streakoid/streakoid-sdk/lib';

export const createTeamStreakDailyTrackerJob = async (timezone: string): Promise<Agenda.Job<{ timezone: string }>> => {
    const endOfDay = moment.tz(timezone).endOf(AgendaTimeRanges.day);
    return (async (): Promise<Agenda.Job<{ timezone: string }>> => {
        const teamStreakDailyTrackerJob = agenda.create(AgendaJobNames.teamStreakDailyTracker, { timezone });
        teamStreakDailyTrackerJob.schedule(endOfDay.toDate());
        await agenda.start();
        await teamStreakDailyTrackerJob.repeatEvery(AgendaProcessTimes.oneDay).save();
        return teamStreakDailyTrackerJob;
    })();
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const initialiseTeamStreakTimezoneCheckerJobs = async () => {
    const timezones = moment.tz.names();
    const numberOfTimezones = timezones.length;

    const numberOfTeamStreakTimezoneCheckerJobs = await agendaJobModel.countDocuments({
        name: AgendaJobNames.teamStreakDailyTracker,
    });
    console.log(`Number of team streak daily tracker jobs: ${numberOfTeamStreakTimezoneCheckerJobs}`);
    console.log(`Number of timezones: ${numberOfTimezones}`);
    if (numberOfTimezones === numberOfTeamStreakTimezoneCheckerJobs) {
        console.log(
            'Number of timezones matches number of team streak timezone checker jobs. No jobs need to be created',
        );
        return;
    }

    return timezones.map(async (timezone: string) => {
        const existingTimezone = await agendaJobModel.findOne({
            name: AgendaJobNames.teamStreakDailyTracker,
            'data.timezone': timezone,
        });

        if (!existingTimezone) {
            await createTeamStreakDailyTrackerJob(timezone);
        }
    });
};
