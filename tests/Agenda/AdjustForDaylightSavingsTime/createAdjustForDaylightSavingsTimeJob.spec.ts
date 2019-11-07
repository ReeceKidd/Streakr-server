import { isTestEnvironment } from '../../../tests/setup/isTestEnvironment';
import { tearDownDatabase } from '../../../tests/setup/tearDownDatabase';
import { setupDatabase } from '../../../tests/setup/setupDatabase';
import { createAdjustForDaylightSavingsTimeJob } from '../../../src/scripts/initialiseAdjustForDaylightSavingsTimeJobs';
import { AgendaJobNames } from '@streakoid/streakoid-sdk/lib';
import moment = require('moment');

jest.setTimeout(120000);

describe('createAdjustForDaylightSavingsTimeJob', () => {
    beforeAll(async () => {
        if (isTestEnvironment()) {
            await setupDatabase();
        }
    });

    afterAll(async () => {
        if (isTestEnvironment()) {
            await tearDownDatabase();
        }
    });

    test('creates an adjustForDaylightSavingsTime job that runs everyday at miday for the localised time', async () => {
        expect.assertions(5);

        const timezone = 'Europe/London';

        const job = await createAdjustForDaylightSavingsTimeJob(timezone);

        expect(job.attrs.name).toEqual(AgendaJobNames.adjustForDaylightSavingsTime);
        expect(job.attrs.data.timezone).toEqual('Europe/London');
        expect(job.attrs.repeatInterval).toEqual('1 day');

        const localisedNextRunAtHour = moment.tz(new Date(job.attrs.nextRunAt), timezone).hour();
        const localisedNextRunAtMinute = moment.tz(new Date(job.attrs.nextRunAt), timezone).minute();

        expect(localisedNextRunAtHour).toEqual(12);
        expect(localisedNextRunAtMinute).toEqual(0);
    });
});
