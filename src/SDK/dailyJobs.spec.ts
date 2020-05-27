import AgendaJobNames from '@streakoid/streakoid-models/lib/Types/AgendaJobNames';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import { dailyJobs as dailyJobsImport } from './dailyJobs';

describe('SDK dailyJobs', () => {
    const getRequest = jest.fn().mockResolvedValue(true);
    const postRequest = jest.fn().mockResolvedValue(true);
    const dailyJobs = dailyJobsImport({
        getRequest,
        postRequest,
    });

    describe('getAll', () => {
        const agendaJobId = 'agendaJobId';
        const jobName = AgendaJobNames.teamStreakDailyTracker;
        const timezone = 'Europe/London';

        const query = {
            agendaJobId,
            jobName,
            timezone,
        };

        test('calls GET with correct URL when no query parameters are passed', async () => {
            expect.assertions(1);

            await dailyJobs.getAll({});

            expect(getRequest).toBeCalledWith({ route: `/v1/daily-jobs?` });
        });

        test('calls GET with correct URL when all query parameters are passed', async () => {
            expect.assertions(1);

            await dailyJobs.getAll(query);

            expect(getRequest).toBeCalledWith({
                route: `/v1/daily-jobs?agendaJobId=${agendaJobId}&jobName=${jobName}&timezone=${timezone}&`,
            });
        });

        test('calls GET with correct URL when agendaJobId query paramter is passed', async () => {
            expect.assertions(1);

            await dailyJobs.getAll({ agendaJobId });

            expect(getRequest).toBeCalledWith({ route: `/v1/daily-jobs?agendaJobId=${agendaJobId}&` });
        });

        test('calls GET with correct URL when jobName query paramter is passed', async () => {
            expect.assertions(1);

            await dailyJobs.getAll({ jobName });

            expect(getRequest).toBeCalledWith({ route: `/v1/daily-jobs?jobName=${jobName}&` });
        });

        test('calls GET with correct URL when timezone query paramter is passed', async () => {
            expect.assertions(1);

            const timezone = `Europe/London`;

            await dailyJobs.getAll({ timezone });

            expect(getRequest).toBeCalledWith({ route: `/v1/daily-jobs?timezone=${timezone}&` });
        });
    });

    describe('create', () => {
        test('calls POST with correct URL and  parameters', async () => {
            expect.assertions(1);

            const agendaJobId = 'agendaJobId';
            const jobName = AgendaJobNames.soloStreakDailyTracker;
            const timezone = 'Europe/London';
            const localisedJobCompleteTime = new Date().toString();
            const streakType = StreakTypes.solo;

            await dailyJobs.create({
                agendaJobId,
                jobName,
                timezone,
                localisedJobCompleteTime,
                streakType,
            });

            expect(postRequest).toBeCalledWith({
                route: `/v1/daily-jobs`,
                params: {
                    agendaJobId,
                    jobName,
                    timezone,
                    localisedJobCompleteTime,
                    streakType,
                },
            });
        });
    });
});
