import { isTestEnvironment } from '../../../tests/setup/isTestEnvironment';
import { tearDownDatabase } from '../../../tests/setup/tearDownDatabase';
import { setupDatabase } from '../../../tests/setup/setupDatabase';
import { createAdjustForDaylightSavingsTimeJob } from '../../../src/scripts/initialiseAdjustForDaylightSavingsTimeJobs';
import moment = require('moment');
import AgendaJobNames from '@streakoid/streakoid-models/lib/Types/AgendaJobNames';
import { Mongoose } from 'mongoose';

jest.setTimeout(120000);

const testName = 'createAdjustForDaylightSavingsTimeJob';

describe(testName, () => {
    let database: Mongoose;
    beforeEach(async () => {
        if (isTestEnvironment()) {
            database = await setupDatabase({ testName });
        }
    });

    afterEach(async () => {
        if (isTestEnvironment()) {
            await tearDownDatabase({ database });
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
