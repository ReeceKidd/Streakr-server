import { streakoidTest } from './setup/streakoidTest';
import { getPayingUser } from './setup/getPayingUser';
import { StreakoidFactory } from '../src/streakoid';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { setUpDatabase } from './setup/setUpDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import AgendaJobNames from '@streakoid/streakoid-models/lib/Types/AgendaJobNames';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';

jest.setTimeout(120000);

describe('GET /complete-solo-streak-tasks', () => {
    let streakoid: StreakoidFactory;

    beforeAll(async () => {
        if (isTestEnvironment()) {
            await setUpDatabase();
            await getPayingUser();
            streakoid = await streakoidTest();
        }
    });

    afterAll(async () => {
        if (isTestEnvironment()) {
            await tearDownDatabase();
        }
    });

    test(`creates a successful soloStreakDailyTrackerJob dailyJob`, async () => {
        expect.assertions(9);

        const agendaJobId = 'agendaJobId';
        const timezone = 'Europe/London';
        const localisedJobCompleteTime = new Date().toString();

        const dailyJob = await streakoid.dailyJobs.create({
            agendaJobId,
            jobName: AgendaJobNames.soloStreakDailyTracker,
            timezone,
            localisedJobCompleteTime,
            streakType: StreakTypes.solo,
        });

        expect(dailyJob._id).toEqual(expect.any(String));
        expect(dailyJob.agendaJobId).toEqual(agendaJobId);
        expect(dailyJob.jobName).toEqual(AgendaJobNames.soloStreakDailyTracker);
        expect(dailyJob.timezone).toEqual('Europe/London');
        expect(dailyJob.localisedJobCompleteTime).toEqual(localisedJobCompleteTime);
        expect(dailyJob.streakType).toEqual(StreakTypes.solo);
        expect(dailyJob.createdAt).toEqual(expect.any(String));
        expect(dailyJob.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(dailyJob).sort()).toEqual(
            [
                '_id',
                'agendaJobId',
                'jobName',
                'timezone',
                'localisedJobCompleteTime',
                'streakType',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );
    });
});
