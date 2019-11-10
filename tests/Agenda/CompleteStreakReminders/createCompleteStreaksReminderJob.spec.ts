import { isTestEnvironment } from '../../setup/isTestEnvironment';
import { tearDownDatabase } from '../../setup/tearDownDatabase';
import { setupDatabase } from '../../setup/setupDatabase';
import { AgendaJobNames } from '@streakoid/streakoid-sdk/lib';
import { createCompleteStreakReminder } from '../../../src/scripts/initialiseCompleteStreakReminders';

jest.setTimeout(120000);

describe('createCompleteStreaksReminderJob', () => {
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

    test('creates an completeStreaksReminder job that runs everyday at the hour specified for the timezone', async () => {
        expect.assertions(4);

        const timezone = 'Europe/London';
        const hour = 21;

        const job = await createCompleteStreakReminder(timezone, hour);

        expect(job.attrs.name).toEqual(AgendaJobNames.completeStreaksReminder);
        expect(job.attrs.data.timezone).toEqual('Europe/London');
        expect(job.attrs.data.hour).toEqual(hour);
        expect(job.attrs.repeatInterval).toEqual('1 day');
    });
});
