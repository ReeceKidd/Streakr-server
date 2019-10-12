import Agenda from 'agenda';
import moment from 'moment-timezone';

import { getServiceConfig } from '../getServiceConfig';
import { manageDailySoloStreaks } from './SoloStreaks/manageDailySoloStreaks';
import { sendEmail } from '../email';
import { AgendaJobNames, StreakTypes } from '@streakoid/streakoid-sdk/lib';
import streakoid from '../../src/streakoid';

const { DATABASE_URI, NODE_ENV } = getServiceConfig();

export enum AgendaTimeRanges {
    day = 'day',
}

export enum AgendaProcessTimes {
    oneDay = '1 day',
}

export const agenda = new Agenda({
    db: {
        address: DATABASE_URI,
        collection: 'AgendaJobs',
        options: {
            useNewUrlParser: true,
        },
    },
    processEvery: '30 Seconds',
});

agenda.on('success', async job => {
    try {
        if (job.attrs.data.timezone === 'Europe/London' && NODE_ENV !== 'test') {
            const message = `
        Environment: ${NODE_ENV}
        Job name: ${job.attrs.name}
        Timezone: ${job.attrs.data.timezone}
        Local next run time: ${job.attrs.nextRunAt}
        Run time: ${new Date()}`;
            await sendEmail('Agenda Success', message);
        }
    } catch (err) {
        console.log(err);
    }
});

agenda.on('fail', async (err, job) => {
    try {
        const message = `
        Envirionment: ${NODE_ENV}
        Ran job: ${job.attrs.name} for timezone: ${job.attrs.data.timezone},
      At ${new Date()}
      Failure reason: ${err.message}
      Failure count ${job.attrs.failCount}
      err: ${err.toString()}`;
        await sendEmail('Agenda Failure', message);
    } catch (err) {
        console.log(err);
    }
});

agenda.define(AgendaJobNames.soloStreakDailyTracker, { priority: 'high' }, async (job, done) => {
    try {
        const { timezone } = job.attrs.data;

        await manageDailySoloStreaks(timezone);

        const localisedJobCompleteTime = moment
            .tz(timezone)
            .toDate()
            .toString();

        await streakoid.dailyJobs.create({
            agendaJobId: String(job.attrs._id),
            jobName: AgendaJobNames.soloStreakDailyTracker,
            timezone,
            localisedJobCompleteTime,
            streakType: StreakTypes.solo,
            wasSuccessful: true,
        });
        done();
    } catch (err) {
        try {
            const { timezone } = job.attrs.data;
            const localisedJobCompleteTime = moment
                .tz(timezone)
                .toDate()
                .toString();
            await streakoid.dailyJobs.create({
                agendaJobId: String(job.attrs._id),
                jobName: AgendaJobNames.soloStreakDailyTracker,
                timezone,
                localisedJobCompleteTime,
                streakType: StreakTypes.solo,
                wasSuccessful: false,
            });
        } catch (err) {
            done(err);
        }
        done(err);
    }
});
