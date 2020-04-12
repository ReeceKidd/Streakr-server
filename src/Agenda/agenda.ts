import Agenda from 'agenda';

import { getServiceConfig } from '../getServiceConfig';
import { manageDailySoloStreaks } from './SoloStreaks/manageDailySoloStreaks';
import { sendEmail } from '../email';
import { AgendaJobNames } from '@streakoid/streakoid-sdk/lib';
import { manageDailyTeamStreaks } from './TeamStreaks/manageDailyTeamStreaks';
import { adjustForDaylightSavingsTime } from './AdjustForDaylightSavingsTime/adjustForDaylightSavingsTime';
import { manageDailyChallengeStreaks } from './ChallengeStreaks/manageDailyChallengeStreaks';

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

agenda.on('fail', async (err, job) => {
    try {
        const message = `
        Envirionment: ${NODE_ENV}
        Ran job: ${job.attrs.name} for timezone: ${job.attrs.data.timezone},
      At ${new Date()}
      Failure reason: ${err.message}
      Failure count ${job.attrs.failCount}
      err: ${err.toString()}`;
        await sendEmail({ subject: 'Agenda Failure', text: message, emailFrom: 'notify@streakoid.com' });
    } catch (err) {
        console.log(err);
    }
});

agenda.define(AgendaJobNames.soloStreakDailyTracker, { priority: 'high' }, async (job, done) => {
    try {
        const { timezone } = job.attrs.data;

        await manageDailySoloStreaks({ agendaJobId: String(job.attrs._id), timezone });
        done();
    } catch (err) {
        done(err);
    }
});

agenda.define(AgendaJobNames.teamStreakDailyTracker, { priority: 'high' }, async (job, done) => {
    try {
        const { timezone } = job.attrs.data;

        await manageDailyTeamStreaks({ agendaJobId: String(job.attrs._id), timezone });
        done();
    } catch (err) {
        done(err);
    }
});

agenda.define(AgendaJobNames.challengeStreakDailyTracker, { priority: 'high' }, async (job, done) => {
    try {
        const { timezone } = job.attrs.data;

        await manageDailyChallengeStreaks({ agendaJobId: String(job.attrs._id), timezone });
        done();
    } catch (err) {
        done(err);
    }
});

agenda.define(AgendaJobNames.adjustForDaylightSavingsTime, async (job, done) => {
    try {
        const { timezone } = job.attrs.data;
        await adjustForDaylightSavingsTime(timezone);
        done();
    } catch (err) {
        done(err);
    }
});
