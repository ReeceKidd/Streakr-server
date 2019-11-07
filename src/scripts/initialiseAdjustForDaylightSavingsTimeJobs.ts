import moment from 'moment';

import { agendaJobModel } from '../Models/AgendaJob';
import { agenda, AgendaProcessTimes } from '../Agenda/agenda';
import Agenda from 'agenda';
import { AgendaJobNames } from '@streakoid/streakoid-sdk/lib';

export const createAdjustForDaylightSavingsTimeJob = async (
    timezone: string,
): Promise<Agenda.Job<{ timezone: string }>> => {
    const midDay = moment
        .tz(timezone)
        .hour(12)
        .minute(0);
    return (async (): Promise<Agenda.Job<{ timezone: string }>> => {
        const adjustForDaylightSavingsTimeJob = agenda.create(AgendaJobNames.adjustForDaylightSavingsTime, {
            timezone,
        });
        adjustForDaylightSavingsTimeJob.schedule(midDay.toDate());
        await agenda.start();
        await adjustForDaylightSavingsTimeJob.repeatEvery(AgendaProcessTimes.oneDay).save();
        return adjustForDaylightSavingsTimeJob;
    })();
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const initialiseAdjustForDaylightSavingsJobs = async () => {
    const timezones = moment.tz.names();
    const numberOfTimezones = timezones.length;

    const numberOfAdjustForDaylightSavingsTimeJobs = await agendaJobModel.countDocuments({
        name: AgendaJobNames.adjustForDaylightSavingsTime,
    });
    console.log(`Number of adjust for daylight savings time jobs: ${numberOfAdjustForDaylightSavingsTimeJobs}`);
    console.log(`Number of timezones: ${numberOfTimezones}`);
    if (numberOfTimezones === numberOfAdjustForDaylightSavingsTimeJobs) {
        console.log(
            'Number of timezones matches number of adjustForDaylightSavings time jobs. No jobs need to be created',
        );
        return;
    }

    await Promise.all(
        timezones.map(async (timezone: string) => {
            const existingTimezone = await agendaJobModel.findOne({
                name: AgendaJobNames.adjustForDaylightSavingsTime,
                'data.timezone': timezone,
            });

            if (!existingTimezone) {
                await createAdjustForDaylightSavingsTimeJob(timezone);
            }
        }),
    );

    console.log('Initalised adjust for daylight savings time jobs');
};
