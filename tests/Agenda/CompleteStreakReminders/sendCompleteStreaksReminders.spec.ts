import { isTestEnvironment } from '../../setup/isTestEnvironment';
import { tearDownDatabase } from '../../setup/tearDownDatabase';
import { setupDatabase } from '../../setup/setupDatabase';
import { getPayingUser } from '../../setup/getPayingUser';
import { sendCompleteStreakReminders } from '../../../src/Agenda/SendCompleteStreaksReminder/sendCompleteStreaksReminder';

jest.setTimeout(120000);

describe('sendCompleteStreakReminders', () => {
    beforeAll(async () => {
        if (isTestEnvironment()) {
            await setupDatabase();
            await getPayingUser();
        }
    });

    afterAll(async () => {
        if (isTestEnvironment()) {
            await tearDownDatabase();
        }
    });
    test('sends push notification to user who wants reminder without an error', async () => {
        expect.assertions(1);

        const timezone = 'Europe/London';
        const hour = 21;

        await sendCompleteStreakReminders({ timezone, hour });
        expect(true).toEqual(true);
    });
});
