import { StreakoidFactory, londonTimezone } from '../src/streakoid';
import { streakoidTest } from './setup/streakoidTest';
import { getPayingUser } from './setup/getPayingUser';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { setUpDatabase } from './setup/setUpDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';

jest.setTimeout(120000);

describe('GET /complete-solo-streak-tasks', () => {
    let streakoid: StreakoidFactory;
    let userId: string;
    let teamStreakId: string;
    const streakName = 'Daily Spanish';

    beforeAll(async () => {
        if (isTestEnvironment()) {
            await setUpDatabase();
            const user = await getPayingUser();
            userId = user._id;
            streakoid = await streakoidTest();
            const members = [{ memberId: userId }];

            const teamStreak = await streakoid.teamStreaks.create({
                creatorId: userId,
                streakName,
                members,
            });
            teamStreakId = teamStreak._id;

            await streakoid.teamMemberStreaks.create({
                userId,
                teamStreakId,
            });
        }
    });

    afterAll(async () => {
        if (isTestEnvironment()) {
            await tearDownDatabase();
        }
    });

    test(`team member streaks can be retrieved with userId query parameter`, async () => {
        expect.assertions(13);

        const teamMemberStreaks = await streakoid.teamMemberStreaks.getAll({
            userId,
        });
        expect(teamMemberStreaks.length).toBeGreaterThanOrEqual(1);

        const teamMemberStreak = teamMemberStreaks[0];

        expect(teamMemberStreak._id).toEqual(expect.any(String));
        expect(teamMemberStreak.currentStreak.numberOfDaysInARow).toEqual(0);
        expect(Object.keys(teamMemberStreak.currentStreak).sort()).toEqual(['numberOfDaysInARow'].sort());
        expect(teamMemberStreak.completedToday).toEqual(false);
        expect(teamMemberStreak.active).toEqual(false);
        expect(teamMemberStreak.pastStreaks).toEqual([]);
        expect(teamMemberStreak.userId).toEqual(expect.any(String));
        expect(teamMemberStreak.teamStreakId).toEqual(expect.any(String));
        expect(teamMemberStreak.timezone).toEqual(londonTimezone);
        expect(teamMemberStreak.createdAt).toEqual(expect.any(String));
        expect(teamMemberStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(teamMemberStreak).sort()).toEqual(
            [
                '_id',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                'userId',
                'teamStreakId',
                'timezone',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );
    });

    test(`team member streaks can be retreieved with timezone query parameter`, async () => {
        expect.assertions(13);

        const teamMemberStreaks = await streakoid.teamMemberStreaks.getAll({
            timezone: londonTimezone,
        });
        expect(teamMemberStreaks.length).toBeGreaterThanOrEqual(1);

        const teamMemberStreak = teamMemberStreaks[0];

        expect(teamMemberStreak._id).toEqual(expect.any(String));
        expect(teamMemberStreak.currentStreak.numberOfDaysInARow).toEqual(0);
        expect(Object.keys(teamMemberStreak.currentStreak).sort()).toEqual(['numberOfDaysInARow'].sort());
        expect(teamMemberStreak.completedToday).toEqual(false);
        expect(teamMemberStreak.active).toEqual(false);
        expect(teamMemberStreak.pastStreaks).toEqual([]);
        expect(teamMemberStreak.userId).toEqual(expect.any(String));
        expect(teamMemberStreak.teamStreakId).toEqual(expect.any(String));
        expect(teamMemberStreak.timezone).toEqual(londonTimezone);
        expect(teamMemberStreak.createdAt).toEqual(expect.any(String));
        expect(teamMemberStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(teamMemberStreak).sort()).toEqual(
            [
                '_id',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                'userId',
                'teamStreakId',
                'timezone',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );
    });

    test('team member streaks not completed today can be retrieved', async () => {
        expect.assertions(13);

        const teamMemberStreaks = await streakoid.teamMemberStreaks.getAll({
            completedToday: false,
            active: false,
        });
        expect(teamMemberStreaks.length).toBeGreaterThanOrEqual(1);

        const teamMemberStreak = teamMemberStreaks[0];

        expect(teamMemberStreak._id).toEqual(expect.any(String));
        expect(teamMemberStreak.currentStreak.numberOfDaysInARow).toEqual(0);
        expect(Object.keys(teamMemberStreak.currentStreak).sort()).toEqual(['numberOfDaysInARow'].sort());
        expect(teamMemberStreak.completedToday).toEqual(false);
        expect(teamMemberStreak.active).toEqual(false);
        expect(teamMemberStreak.pastStreaks).toEqual([]);
        expect(teamMemberStreak.userId).toEqual(expect.any(String));
        expect(teamMemberStreak.teamStreakId).toEqual(expect.any(String));
        expect(teamMemberStreak.timezone).toEqual(londonTimezone);
        expect(teamMemberStreak.createdAt).toEqual(expect.any(String));
        expect(teamMemberStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(teamMemberStreak).sort()).toEqual(
            [
                '_id',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                'userId',
                'teamStreakId',
                'timezone',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );
    });

    test('team member streaks that have been completed today can be retrieved', async () => {
        expect.assertions(14);

        const streakName = '30 minutes of reading';

        const members = [{ memberId: userId }];

        const secondTeamStreak = await streakoid.teamStreaks.create({
            creatorId: userId,
            streakName,
            members,
        });

        const secondTeamMemberStreak = await streakoid.teamMemberStreaks.create({
            userId,
            teamStreakId,
        });

        await streakoid.completeTeamMemberStreakTasks.create({
            userId,
            teamStreakId: secondTeamStreak._id,
            teamMemberStreakId: secondTeamMemberStreak._id,
        });

        const teamMemberStreaks = await streakoid.teamMemberStreaks.getAll({
            completedToday: true,
        });
        expect(teamMemberStreaks.length).toBeGreaterThanOrEqual(1);

        const teamMemberStreak = teamMemberStreaks[0];

        expect(teamMemberStreak._id).toEqual(expect.any(String));
        expect(teamMemberStreak.currentStreak.numberOfDaysInARow).toEqual(1);
        expect(teamMemberStreak.currentStreak.startDate).toEqual(expect.any(String));
        expect(Object.keys(teamMemberStreak.currentStreak).sort()).toEqual(['numberOfDaysInARow', 'startDate'].sort());
        expect(teamMemberStreak.completedToday).toEqual(true);
        expect(teamMemberStreak.active).toEqual(true);
        expect(teamMemberStreak.pastStreaks).toEqual([]);
        expect(teamMemberStreak.userId).toEqual(expect.any(String));
        expect(teamMemberStreak.teamStreakId).toEqual(expect.any(String));
        expect(teamMemberStreak.timezone).toEqual(londonTimezone);
        expect(teamMemberStreak.createdAt).toEqual(expect.any(String));
        expect(teamMemberStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(teamMemberStreak).sort()).toEqual(
            [
                '_id',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                'userId',
                'teamStreakId',
                'timezone',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );
    });
});
