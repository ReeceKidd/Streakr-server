import { StreakoidFactory } from '../src/streakoid';
import { streakoidTest } from './setup/streakoidTest';
import { getPayingUser } from './setup/getPayingUser';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { setUpDatabase } from './setup/setUpDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';

jest.setTimeout(120000);

describe('DELETE /notes', () => {
    let streakoid: StreakoidFactory;
    let userId: string;

    beforeAll(async () => {
        if (isTestEnvironment()) {
            await setUpDatabase();
            const user = await getPayingUser();
            userId = user._id;
            streakoid = await streakoidTest();
        }
    });

    afterAll(async () => {
        if (isTestEnvironment()) {
            await tearDownDatabase();
        }
    });

    test(`deletes note`, async () => {
        expect.assertions(3);

        const note = await streakoid.notes.create({
            userId,
            subjectId: '5d0fc0de86821005b0e9de5b',
            text: 'Worked on Johnny Cash Hurt',
            streakType: StreakTypes.solo,
        });

        const { status } = await streakoid.notes.deleteOne({ noteId: note._id });

        expect(status).toEqual(204);

        try {
            await streakoid.notes.getOne(note._id);
        } catch (err) {
            expect(err.response.status).toEqual(400);
            expect(err.response.data.message).toEqual('Note does not exist.');
        }
    });
});
