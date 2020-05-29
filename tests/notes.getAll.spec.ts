import { getPayingUser } from './setup/getPayingUser';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { tearDownDatabase } from './setup/tearDownDatabase';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import { Mongoose } from 'mongoose';
import { StreakoidSDK } from '@streakoid/streakoid-sdk/lib/streakoidSDKFactory';
import { setupDatabase } from './setup/setupDatabase';
import { streakoidTestSDK } from './setup/streakoidTestSDK';
import { disconnectDatabase } from './setup/disconnectDatabase';

jest.setTimeout(120000);

const testName = 'GET-notes';

describe(testName, () => {
    let database: Mongoose;
    let SDK: StreakoidSDK;
    beforeAll(async () => {
        if (isTestEnvironment()) {
            database = await setupDatabase({ testName });
            SDK = streakoidTestSDK({ testName });
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

    test(`gets all created notes with no query parameters.`, async () => {
        expect.assertions(6);

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const streakName = 'Daily Spanish';
        const streakDescription = 'I must do 30 minutes of Spanish everyday';
        const numberOfMinutes = 30;

        const soloStreak = await SDK.soloStreaks.create({
            userId,
            streakName,
            streakDescription,
            numberOfMinutes,
        });

        const noteText = 'Finished reading book';

        await SDK.notes.create({
            userId,
            subjectId: soloStreak._id,
            text: noteText,
            streakType: StreakTypes.solo,
        });

        const notes = await SDK.notes.getAll({});

        const note = notes[0];

        expect(note.userId).toBeDefined();
        expect(note.subjectId).toEqual(soloStreak._id);
        expect(note.text).toEqual(noteText);
        expect(note.createdAt).toEqual(expect.any(String));
        expect(note.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(note).sort()).toEqual(
            ['_id', 'userId', 'subjectId', 'text', 'createdAt', 'updatedAt', '__v'].sort(),
        );
    });

    test(`gets all created notes with user query paramter.`, async () => {
        expect.assertions(6);

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const streakName = 'Daily Spanish';
        const streakDescription = 'I must do 30 minutes of Spanish everyday';
        const numberOfMinutes = 30;

        const soloStreak = await SDK.soloStreaks.create({
            userId,
            streakName,
            streakDescription,
            numberOfMinutes,
        });

        const text = 'Finished reading book';

        await SDK.notes.create({ userId, subjectId: soloStreak._id, text, streakType: StreakTypes.solo });

        const notes = await SDK.notes.getAll({ userId });
        const note = notes[0];

        expect(note.userId).toBeDefined();
        expect(note.subjectId).toEqual(soloStreak._id);
        expect(note.text).toEqual(text);
        expect(note.createdAt).toEqual(expect.any(String));
        expect(note.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(note).sort()).toEqual(
            ['_id', 'userId', 'subjectId', 'text', 'createdAt', 'updatedAt', '__v'].sort(),
        );
    });

    test(`gets all created notes with user query paramter.`, async () => {
        expect.assertions(6);

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const streakName = 'Daily Spanish';
        const streakDescription = 'I must do 30 minutes of Spanish everyday';
        const numberOfMinutes = 30;

        const soloStreak = await SDK.soloStreaks.create({
            userId,
            streakName,
            streakDescription,
            numberOfMinutes,
        });

        const text = 'Finished reading book';

        await SDK.notes.create({ userId, subjectId: soloStreak._id, text, streakType: StreakTypes.solo });

        const notes = await SDK.notes.getAll({ subjectId: soloStreak._id });
        const note = notes[0];

        expect(note.userId).toBeDefined();
        expect(note.subjectId).toEqual(soloStreak._id);
        expect(note.text).toEqual(text);
        expect(note.createdAt).toEqual(expect.any(String));
        expect(note.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(note).sort()).toEqual(
            ['_id', 'userId', 'subjectId', 'text', 'createdAt', 'updatedAt', '__v'].sort(),
        );
    });
});
