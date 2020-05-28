import { isTestEnvironment } from './setup/isTestEnvironment';
import { setupDatabase } from './setup/setupDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import { Mongoose } from 'mongoose';
import { StreakoidSDK } from '../src/SDK/streakoidSDKFactory';
import { streakoidTestSDKFactory } from '../src/SDK/streakoidTestSDKFactory';
import { disconnectDatabase } from './setup/disconnectDatabase';
import { getPayingUser } from './setup/getPayingUser';

jest.setTimeout(120000);

const testName = 'delete-notes';

describe(testName, () => {
    let database: Mongoose;
    let SDK: StreakoidSDK;
    beforeAll(async () => {
        if (isTestEnvironment()) {
            database = await setupDatabase({ testName });
            SDK = streakoidTestSDKFactory({ testName });
        }
    });

    afterEach(async () => {
        if (isTestEnvironment()) {
            await tearDownDatabase({ database });
        }
    });

    afterAll(async () => {
        if (isTestEnvironment()) {
            await disconnectDatabase({ database });
        }
    });

    test(`deletes note`, async () => {
        expect.assertions(2);

        const user = await getPayingUser({ testName });
        const userId = user._id;

        const note = await SDK.notes.create({
            userId,
            subjectId: '5d0fc0de86821005b0e9de5b',
            text: 'Worked on Johnny Cash Hurt',
            streakType: StreakTypes.solo,
        });

        await SDK.notes.deleteOne({ noteId: note._id });

        try {
            await SDK.notes.getOne(note._id);
        } catch (err) {
            const error = JSON.parse(err.text);
            const { message } = error;
            expect(err.status).toEqual(400);
            expect(message).toEqual('Note does not exist.');
        }
    });
});
