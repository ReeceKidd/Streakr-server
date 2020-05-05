import { isTestEnvironment } from '../../../tests/setup/isTestEnvironment';
import { tearDownDatabase } from '../../../tests/setup/tearDownDatabase';
import { setupDatabase } from '../../../tests/setup/setupDatabase';
import { createAdjustForDaylightSavingsTimeJob } from '../../../src/scripts/initialiseAdjustForDaylightSavingsTimeJobs';
import moment = require('moment');
import AgendaJobNames from '@streakoid/streakoid-models/lib/Types/AgendaJobNames';

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

    test('creates an adjustForDaylightSavingsTime job that runs everyday at midday for the localized time', async () => {
        expect.assertions(5);

        const timezone = 'Europe/London';

        const job = await createAdjustForDaylightSavingsTimeJob(timezone);

        expect(job.attrs.name).toEqual(AgendaJobNames.adjustForDaylightSavingsTime);
        expect(job.attrs.data.timezone).toEqual('Europe/London');
        expect(job.attrs.repeatInterval).toEqual('1 day');

        const localizedNextRunAtHour = moment.tz(new Date(job.attrs.nextRunAt), timezone).hour();
        const localizedNextRunAtMinute = moment.tz(new Date(job.attrs.nextRunAt), timezone).minute();

        expect(localizedNextRunAtHour).toEqual(12);
        expect(localizedNextRunAtMinute).toEqual(0);
    });
});
