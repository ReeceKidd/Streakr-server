import moment from 'moment';

import { agendaJobModel } from '../Models/AgendaJob';
import { agenda, AgendaProcessTimes } from '../Agenda/agenda';
import Agenda from 'agenda';
import { AgendaJobNames } from '@streakoid/streakoid-sdk/lib';

export const createCompleteStreakReminder = async (
    timezone: string,
    hour: number,
): Promise<Agenda.Job<{ timezone: string; hour: number }>> => {
    return (async (): Promise<Agenda.Job<{ timezone: string; hour: number }>> => {
        const jobTime = moment
            .tz(timezone)
            .hour(hour)
            .minute(0)
            .second(0)
            .add(1, 'days')
            .toDate();
        const completeStreakReminderJob = agenda.create(AgendaJobNames.completeStreaksReminder, {
            timezone,
            hour,
        });
        completeStreakReminderJob.schedule(jobTime);
        await agenda.start();
        completeStreakReminderJob.repeatEvery(AgendaProcessTimes.oneDay);
        return completeStreakReminderJob.save();
    })();
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const initialiseCompleteStreakReminderJobs = async () => {
    const timezones = moment.tz.names();
    const numberOfTimezones = timezones.length;

    const numberOfCompleteStreakReminderJobs = await agendaJobModel.countDocuments({
        name: AgendaJobNames.completeStreaksReminder,
    });
    const hourHandsInDay = [18, 19, 20, 21, 22, 23];
    console.log(`Number of complete streak reminder jobs: ${numberOfCompleteStreakReminderJobs}`);
    console.log(`Number of timezones: ${numberOfTimezones}`);
    if (numberOfTimezones * hourHandsInDay.length === numberOfCompleteStreakReminderJobs) {
        console.log('Number of timezones matches number of complete streak reminder jobs. No jobs need to be created');
        return;
    }

    await Promise.all(
        timezones.map(async (timezone: string) => {
            return Promise.all(
                hourHandsInDay.map(async hour => {
                    await createCompleteStreakReminder(timezone, hour);
                }),
            );
        }),
    );

    console.log('Initalised complete streak reminder jobs');
};
