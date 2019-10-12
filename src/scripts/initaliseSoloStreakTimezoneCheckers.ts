import moment from 'moment';

import { agendaJobModel } from '../Models/AgendaJob';
import { agenda, AgendaTimeRanges, AgendaProcessTimes } from '../Agenda/agenda';
import Agenda from 'agenda';
import { AgendaJobNames } from '@streakoid/streakoid-sdk/lib';

export const createSoloStreakDailyTrackerJob = async (timezone: string): Promise<Agenda.Job<{ timezone: string }>> => {
    const endOfDay = moment.tz(timezone).endOf(AgendaTimeRanges.day);
    return (async (): Promise<Agenda.Job<{ timezone: string }>> => {
        const soloStreakDailyTrackerJob = agenda.create(AgendaJobNames.soloStreakDailyTracker, { timezone });
        soloStreakDailyTrackerJob.schedule(endOfDay.toDate());
        await agenda.start();
        await soloStreakDailyTrackerJob.repeatEvery(AgendaProcessTimes.oneDay).save();
        return soloStreakDailyTrackerJob;
    })();
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const initialiseSoloStreakTimezoneCheckerJobs = async () => {
    const timezones = moment.tz.names();
    const numberOfTimezones = timezones.length;

    const numberOfSoloStreakTimezoneCheckerJobs = await agendaJobModel.countDocuments({
        name: AgendaJobNames.soloStreakDailyTracker,
    });
    console.log(`Number of solo streak daily tracker jobs: ${numberOfSoloStreakTimezoneCheckerJobs}`);
    console.log(`Number of timezones: ${numberOfTimezones}`);
    if (numberOfTimezones === numberOfSoloStreakTimezoneCheckerJobs) {
        console.log(
            'Number of timezones matches number of solo streak timezone checker jobs. No jobs need to be created',
        );
        return;
    }

    return timezones.map(async (timezone: string) => {
        const existingTimezone = await agendaJobModel.findOne({
            name: AgendaJobNames.soloStreakDailyTracker,
            'data.timezone': timezone,
        });

        if (!existingTimezone) {
            await createSoloStreakDailyTrackerJob(timezone);
        }
    });
};
