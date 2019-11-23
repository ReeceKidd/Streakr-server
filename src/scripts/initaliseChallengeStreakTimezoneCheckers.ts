import moment from 'moment';

import { agendaJobModel } from '../Models/AgendaJob';
import { agenda, AgendaTimeRanges, AgendaProcessTimes } from '../Agenda/agenda';
import Agenda from 'agenda';
import { AgendaJobNames } from '@streakoid/streakoid-sdk/lib';

export const createChallengeStreakDailyTrackerJob = async (
    timezone: string,
): Promise<Agenda.Job<{ timezone: string }>> => {
    const endOfDay = moment.tz(timezone).endOf(AgendaTimeRanges.day);
    return (async (): Promise<Agenda.Job<{ timezone: string }>> => {
        const challengeStreakDailyTrackerJob = agenda.create(AgendaJobNames.challengeStreakDailyTracker, { timezone });
        challengeStreakDailyTrackerJob.schedule(endOfDay.toDate());
        await agenda.start();
        await challengeStreakDailyTrackerJob.repeatEvery(AgendaProcessTimes.oneDay).save();
        return challengeStreakDailyTrackerJob;
    })();
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const initialiseChallengeStreakTimezoneCheckerJobs = async () => {
    const timezones = moment.tz.names();
    const numberOfTimezones = timezones.length;

    const numberOfChallengeStreakTimezoneCheckerJobs = await agendaJobModel.countDocuments({
        name: AgendaJobNames.challengeStreakDailyTracker,
    });
    console.log(`Number of challenge streak daily tracker jobs: ${numberOfChallengeStreakTimezoneCheckerJobs}`);
    console.log(`Number of timezones: ${numberOfTimezones}`);
    if (numberOfTimezones === numberOfChallengeStreakTimezoneCheckerJobs) {
        console.log(
            'Number of timezones matches number of challenge streak timezone checker jobs. No jobs need to be created',
        );
        return;
    }

    await Promise.all(
        timezones.map(async (timezone: string) => {
            const existingTimezone = await agendaJobModel.findOne({
                name: AgendaJobNames.challengeStreakDailyTracker,
                'data.timezone': timezone,
            });

            if (!existingTimezone) {
                await createChallengeStreakDailyTrackerJob(timezone);
            }
        }),
    );

    console.log('Initalised challenge streak timezone checker jobs');
};
