import { StreakoidFactory, londonTimezone } from '../src/streakoid';
import { streakoidTest } from './setup/streakoidTest';
import { getPayingUser } from './setup/getPayingUser';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { setUpDatabase } from './setup/setUpDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';

jest.setTimeout(120000);

describe('GET /complete-solo-streak-tasks', () => {
    let streakoid: StreakoidFactory;

    beforeEach(async () => {
        if (isTestEnvironment()) {
            await setUpDatabase();
            streakoid = await streakoidTest();
        }
    });

    afterEach(async () => {
        if (isTestEnvironment()) {
            await tearDownDatabase();
        }
    });

    test(`creates teamMember streak associated with teamId`, async () => {
        expect.assertions(12);

        const user = await getPayingUser();
        const userId = user._id;
        const streakName = 'Daily Spanish';
        const members = [{ memberId: userId }];

        const teamStreak = await streakoid.teamStreaks.create({
            creatorId: userId,
            streakName,
            members,
        });
        const teamStreakId = teamStreak._id;

        const teamMemberStreak = await streakoid.teamMemberStreaks.create({
            userId,
            teamStreakId,
        });

        const {
            _id,
            currentStreak,
            completedToday,
            active,
            timezone,
            pastStreaks,
            createdAt,
            updatedAt,
        } = teamMemberStreak;

        expect(Object.keys(currentStreak)).toEqual(['numberOfDaysInARow']);
        expect(currentStreak.numberOfDaysInARow).toEqual(0);
        expect(completedToday).toEqual(false);
        expect(active).toEqual(false);
        expect(pastStreaks).toEqual([]);
        expect(_id).toBeDefined();
        expect(userId).toBeDefined();
        expect(teamStreakId).toEqual(teamStreakId);
        expect(timezone).toEqual(londonTimezone);
        expect(createdAt).toEqual(expect.any(String));
        expect(updatedAt).toEqual(expect.any(String));
        expect(Object.keys(teamMemberStreak).sort()).toEqual(
            [
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                '_id',
                'userId',
                'teamStreakId',
                'timezone',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );
    });

    test(`increases team member totalLiveStreaks by one when team member streak is created.`, async () => {
        expect.assertions(1);

        const user = await getPayingUser();
        const streakName = 'Daily Spanish';
        const members = [{ memberId: user._id }];

        await streakoid.teamStreaks.create({
            creatorId: user._id,
            streakName,
            members,
        });

        const { totalLiveStreaks } = await streakoid.users.getOne(user._id);
        expect(totalLiveStreaks).toEqual(1);
    });

    test('throws userId does not exist error', async () => {
        expect.assertions(2);

        const user = await getPayingUser();
        const userId = user._id;
        const streakName = 'Daily Spanish';
        const members = [{ memberId: userId }];

        const teamStreak = await streakoid.teamStreaks.create({
            creatorId: userId,
            streakName,
            members,
        });
        const teamStreakId = teamStreak._id;

        try {
            await streakoid.teamMemberStreaks.create({
                userId: 'incorrect-userid',
                teamStreakId,
            });
        } catch (err) {
            expect(err.response.status).toEqual(500);
            expect(err.response.data.code).toEqual('500-113');
        }
    });

    test('throws teamStreakId does not exist error', async () => {
        expect.assertions(2);

        const user = await getPayingUser();
        const userId = user._id;
        const streakName = 'Daily Spanish';
        const members = [{ memberId: userId }];

        await streakoid.teamStreaks.create({
            creatorId: userId,
            streakName,
            members,
        });

        try {
            await streakoid.teamMemberStreaks.create({
                userId,
                teamStreakId: 'incorrect-team-streak-id',
            });
        } catch (err) {
            expect(err.response.status).toEqual(500);
            expect(err.response.data.code).toEqual('500-114');
        }
    });
});
