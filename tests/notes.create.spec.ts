import { StreakoidFactory } from '../src/streakoid';
import { streakoidTest } from './setup/streakoidTest';
import { getPayingUser } from './setup/getPayingUser';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { setUpDatabase } from './setup/setUpDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import { getFriend } from './setup/getFriend';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';

jest.setTimeout(120000);

const streakName = 'Daily Spanish';
const streakDescription = 'I must do 30 minutes of Spanish everyday';
const numberOfMinutes = 30;

describe('POST /notes', () => {
    let streakoid: StreakoidFactory;
    let userId: string;
    let followerId: string;

    beforeEach(async () => {
        if (isTestEnvironment()) {
            await setUpDatabase();
            const user = await getPayingUser();
            userId = user._id;
            streakoid = await streakoidTest();
            const follower = await getFriend();
            followerId = follower._id;
        }
    });

    afterEach(async () => {
        if (isTestEnvironment()) {
            await tearDownDatabase();
        }
    });

    test(`creates a note for a solo streak`, async () => {
        expect.assertions(6);

        const soloStreak = await streakoid.soloStreaks.create({
            userId,
            streakName,
            streakDescription,
            numberOfMinutes,
        });

        const text = 'Finished reading book';

        const note = await streakoid.notes.create({
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

        const members = [{ memberId: userId }];

        const teamStreak = await streakoid.teamStreaks.create({
            creatorId: userId,
            streakName,
            members,
        });

        const text = 'Finished reading book';

        const note = await streakoid.notes.create({
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

        const members = [{ memberId: userId }];

        const teamStreak = await streakoid.teamStreaks.create({
            creatorId: userId,
            streakName,
            members,
        });

        await streakoid.teamStreaks.teamMembers.create({
            followerId,
            teamStreakId: teamStreak._id,
        });

        const text = 'Finished reading book';

        const note = await streakoid.notes.create({
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
