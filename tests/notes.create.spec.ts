import { getPayingUser } from './setup/getPayingUser';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { setupDatabase } from './setup/setupDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import { getFriend } from './setup/getFriend';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import { Mongoose } from 'mongoose';
import { StreakoidSDK } from '@streakoid/streakoid-sdk/lib/streakoidSDKFactory';
import { streakoidTestSDK } from './setup/streakoidTestSDK';
import { disconnectDatabase } from './setup/disconnectDatabase';

jest.setTimeout(120000);

const testName = 'POST-notes';

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

    test(`creates a note for a solo streak`, async () => {
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

        const note = await SDK.notes.create({
            userId,
            subjectId: soloStreak._id,
            text,
            streakType: StreakTypes.solo,
        });

        expect(note.userId).toBeDefined();
        expect(note.subjectId).toEqual(soloStreak._id);
        expect(note.text).toEqual(text);
        expect(note.createdAt).toEqual(expect.any(String));
        expect(note.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(note).sort()).toEqual(
            ['_id', 'userId', 'subjectId', 'text', 'createdAt', 'updatedAt', '__v'].sort(),
        );
    });

    test(`creates a note for a team streak with one member`, async () => {
        expect.assertions(6);

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const streakName = 'Daily Spanish';

        const members = [{ memberId: userId }];

        const teamStreak = await SDK.teamStreaks.create({
            creatorId: userId,
            streakName,
            members,
        });

        const text = 'Finished reading book';

        const note = await SDK.notes.create({
            userId,
            subjectId: teamStreak._id,
            text,
            streakType: StreakTypes.team,
        });

        expect(note.userId).toBeDefined();
        expect(note.subjectId).toEqual(teamStreak._id);
        expect(note.text).toEqual(text);
        expect(note.createdAt).toEqual(expect.any(String));
        expect(note.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(note).sort()).toEqual(
            ['_id', 'userId', 'subjectId', 'text', 'createdAt', 'updatedAt', '__v'].sort(),
        );
    });

    test(`creates a note for a team streak with two members to test push notifications`, async () => {
        expect.assertions(6);

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const friend = await getFriend({ testName });
        const friendId = friend._id;
        const streakName = 'Daily Spanish';

        const members = [{ memberId: userId }];

        const teamStreak = await SDK.teamStreaks.create({
            creatorId: userId,
            streakName,
            members,
        });

        await SDK.teamStreaks.teamMembers.create({
            userId: friendId,
            teamStreakId: teamStreak._id,
        });

        const text = 'Finished reading book';

        const note = await SDK.notes.create({
            userId,
            subjectId: teamStreak._id,
            text,
            streakType: StreakTypes.team,
        });

        expect(note.userId).toBeDefined();
        expect(note.subjectId).toEqual(teamStreak._id);
        expect(note.text).toEqual(text);
        expect(note.createdAt).toEqual(expect.any(String));
        expect(note.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(note).sort()).toEqual(
            ['_id', 'userId', 'subjectId', 'text', 'createdAt', 'updatedAt', '__v'].sort(),
        );
    });
});
