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

const testName = 'GET-notes-noteId';

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

    test(`get note with noteId`, async () => {
        expect.assertions(6);
        const user = await getPayingUser({ testName });
        const userId = user._id;

        const note = await SDK.notes.create({
            userId,
            subjectId: '5d0fc0de86821005b0e9de5b',
            text: 'Worked on Johnny Cash Hurt',
            streakType: StreakTypes.solo,
        });
        expect(note.userId).toBeDefined();
        expect(note.subjectId).toEqual(expect.any(String));
        expect(note.text).toEqual(expect.any(String));
        expect(note.createdAt).toEqual(expect.any(String));
        expect(note.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(note).sort()).toEqual(
            ['_id', 'userId', 'subjectId', 'text', 'createdAt', 'updatedAt', '__v'].sort(),
        );
    });
});
