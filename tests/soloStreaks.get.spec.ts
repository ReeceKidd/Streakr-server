import { StreakoidFactory, londonTimezone } from '../src/streakoid';
import { streakoidTest } from './setup/streakoidTest';
import { isTestEnvironment } from './setup/isTestEnvironment';
import { setUpDatabase } from './setup/setUpDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import { getPayingUser } from './setup/getPayingUser';
import { GetAllSoloStreaksSortFields } from '../src/soloStreaks';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';

jest.setTimeout(120000);

describe('GET /solo-streaks', () => {
    let streakoid: StreakoidFactory;
    let userId: string;
    const streakName = 'Daily Spanish';
    const streakDescription = 'Everyday I must do Spanish';

    beforeAll(async () => {
        if (isTestEnvironment()) {
            await setUpDatabase();
            const user = await getPayingUser();
            userId = user._id;
            streakoid = await streakoidTest();
            await streakoid.soloStreaks.create({
                userId,
                streakName,
                streakDescription,
            });
        }
    });

    afterAll(async () => {
        if (isTestEnvironment()) {
            await tearDownDatabase();
        }
    });

    test(`solo streaks can be retrieved with user query parameter`, async () => {
        expect.assertions(15);

        const soloStreaks = await streakoid.soloStreaks.getAll({ userId });
        expect(soloStreaks.length).toBeGreaterThanOrEqual(1);

        const soloStreak = soloStreaks[0];

        expect(soloStreak.currentStreak).toEqual({
            numberOfDaysInARow: 0,
        });
        expect(soloStreak.status).toEqual(StreakStatus.live);
        expect(Object.keys(soloStreak.currentStreak)).toEqual(['numberOfDaysInARow']);
        expect(soloStreak.completedToday).toEqual(false);
        expect(soloStreak.active).toEqual(false);
        expect(soloStreak.pastStreaks).toEqual([]);
        expect(soloStreak._id).toEqual(expect.any(String));
        expect(soloStreak.streakName).toEqual(expect.any(String));
        expect(soloStreak.streakDescription).toEqual(expect.any(String));
        expect(soloStreak.userId).toBeDefined();
        expect(soloStreak.timezone).toEqual(londonTimezone);
        expect(soloStreak.createdAt).toEqual(expect.any(String));
        expect(soloStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(soloStreak).sort()).toEqual(
            [
                'status',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                '_id',
                'streakName',
                'streakDescription',
                'userId',
                'timezone',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );
    });

    test('incomplete solo streaks can be retrieved', async () => {
        expect.assertions(16);

        const newSoloStreak = await streakoid.soloStreaks.create({
            userId,
            streakName,
        });

        // Simulate an incomplete solo streak
        await streakoid.soloStreaks.update({
            soloStreakId: newSoloStreak._id,
            updateData: {
                active: true,
                completedToday: false,
                currentStreak: {
                    startDate: new Date().toString(),
                    numberOfDaysInARow: 1,
                },
            },
        });

        const soloStreaks = await streakoid.soloStreaks.getAll({
            userId,
            completedToday: false,
            active: true,
            status: StreakStatus.live,
        });
        expect(soloStreaks.length).toBeGreaterThanOrEqual(1);

        const soloStreak = soloStreaks[0];

        expect(soloStreak.currentStreak.numberOfDaysInARow).toEqual(expect.any(Number));
        expect(soloStreak.currentStreak.startDate).toEqual(expect.any(String));
        expect(Object.keys(soloStreak.currentStreak).sort()).toEqual(['numberOfDaysInARow', 'startDate'].sort());
        expect(soloStreak.status).toEqual(StreakStatus.live);
        expect(soloStreak.completedToday).toEqual(false);
        expect(soloStreak.active).toEqual(true);
        expect(soloStreak.pastStreaks).toEqual([]);
        expect(soloStreak._id).toEqual(expect.any(String));
        expect(soloStreak.streakName).toEqual(expect.any(String));
        expect(soloStreak.streakDescription).toEqual(expect.any(String));
        expect(soloStreak.userId).toEqual(expect.any(String));
        expect(soloStreak.timezone).toEqual(expect.any(String));
        expect(soloStreak.createdAt).toEqual(expect.any(String));
        expect(soloStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(soloStreak).sort()).toEqual(
            [
                'currentStreak',
                'status',
                'completedToday',
                'active',
                'pastStreaks',
                '_id',
                'streakName',
                'streakDescription',
                'userId',
                'timezone',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );
    });

    test('completed solo streaks can be retrieved', async () => {
        expect.assertions(16);

        const streakName = '30 minutes of reading';
        const streakDescription = 'Every day I must do 30 minutes of reading';

        const secondSoloStreak = await streakoid.soloStreaks.create({
            userId,
            streakName,
            streakDescription,
        });
        const secondSoloStreakId = secondSoloStreak._id;

        await streakoid.completeSoloStreakTasks.create({
            userId,
            soloStreakId: secondSoloStreakId,
        });

        const soloStreaks = await streakoid.soloStreaks.getAll({
            userId,
            completedToday: true,
        });
        expect(soloStreaks.length).toBeGreaterThanOrEqual(1);

        const soloStreak = soloStreaks[0];

        expect(soloStreak.status).toEqual(StreakStatus.live);
        expect(soloStreak.currentStreak.numberOfDaysInARow).toBeGreaterThanOrEqual(1);
        expect(soloStreak.currentStreak.startDate).toEqual(expect.any(String));
        expect(Object.keys(soloStreak.currentStreak).sort()).toEqual(['numberOfDaysInARow', 'startDate'].sort());
        expect(soloStreak.completedToday).toEqual(true);
        expect(soloStreak.active).toEqual(true);
        expect(soloStreak.pastStreaks).toEqual([]);
        expect(soloStreak._id).toEqual(expect.any(String));
        expect(soloStreak.streakName).toEqual(expect.any(String));
        expect(soloStreak.streakDescription).toEqual(expect.any(String));
        expect(soloStreak.userId).toEqual(expect.any(String));
        expect(soloStreak.timezone).toEqual(expect.any(String));
        expect(soloStreak.createdAt).toEqual(expect.any(String));
        expect(soloStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(soloStreak).sort()).toEqual(
            [
                'status',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                '_id',
                'streakName',
                'streakDescription',
                'userId',
                'timezone',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );
    });

    test('archived solo streaks can be retrieved', async () => {
        expect.assertions(14);

        const streakName = '30 minutes of reading';
        const streakDescription = 'Every day I must do 30 minutes of reading';

        const secondSoloStreak = await streakoid.soloStreaks.create({
            userId,
            streakName,
            streakDescription,
        });
        const secondSoloStreakId = secondSoloStreak._id;

        await streakoid.soloStreaks.update({
            soloStreakId: secondSoloStreakId,
            updateData: { status: StreakStatus.archived },
        });

        const soloStreaks = await streakoid.soloStreaks.getAll({
            userId,
            status: StreakStatus.archived,
        });

        const soloStreak = soloStreaks[0];

        expect(soloStreak.status).toEqual(StreakStatus.archived);
        expect(soloStreak.currentStreak.numberOfDaysInARow).toEqual(0);
        expect(Object.keys(soloStreak.currentStreak).sort()).toEqual(['numberOfDaysInARow'].sort());
        expect(soloStreak.completedToday).toEqual(false);
        expect(soloStreak.active).toEqual(false);
        expect(soloStreak.pastStreaks).toEqual([]);
        expect(soloStreak._id).toEqual(expect.any(String));
        expect(soloStreak.streakName).toEqual(streakName);
        expect(soloStreak.streakDescription).toEqual(streakDescription);
        expect(soloStreak.userId).toEqual(expect.any(String));
        expect(soloStreak.timezone).toEqual(expect.any(String));
        expect(soloStreak.createdAt).toEqual(expect.any(String));
        expect(soloStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(soloStreak).sort()).toEqual(
            [
                'status',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                '_id',
                'streakName',
                'streakDescription',
                'userId',
                'timezone',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );
    });

    test('deleted solo streaks can be retrieved', async () => {
        expect.assertions(14);

        const streakName = '30 minutes of reading';
        const streakDescription = 'Every day I must do 30 minutes of reading';

        const secondSoloStreak = await streakoid.soloStreaks.create({
            userId,
            streakName,
            streakDescription,
        });
        const secondSoloStreakId = secondSoloStreak._id;

        await streakoid.soloStreaks.update({
            soloStreakId: secondSoloStreakId,
            updateData: { status: StreakStatus.deleted },
        });

        const soloStreaks = await streakoid.soloStreaks.getAll({
            userId,
            status: StreakStatus.deleted,
        });

        const soloStreak = soloStreaks[0];

        expect(soloStreak.status).toEqual(StreakStatus.deleted);
        expect(soloStreak.currentStreak.numberOfDaysInARow).toEqual(0);
        expect(Object.keys(soloStreak.currentStreak).sort()).toEqual(['numberOfDaysInARow'].sort());
        expect(soloStreak.completedToday).toEqual(false);
        expect(soloStreak.active).toEqual(false);
        expect(soloStreak.pastStreaks).toEqual([]);
        expect(soloStreak._id).toEqual(expect.any(String));
        expect(soloStreak.streakName).toEqual(streakName);
        expect(soloStreak.streakDescription).toEqual(streakDescription);
        expect(soloStreak.userId).toEqual(expect.any(String));
        expect(soloStreak.timezone).toEqual(expect.any(String));
        expect(soloStreak.createdAt).toEqual(expect.any(String));
        expect(soloStreak.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(soloStreak).sort()).toEqual(
            [
                'status',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                '_id',
                'streakName',
                'streakDescription',
                'userId',
                'timezone',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );
    });

    test(`solo streaks can be retrieved using sortField query parameter`, async () => {
        expect.assertions(2);

        const soloStreaks = await streakoid.soloStreaks.getAll({
            sortField: GetAllSoloStreaksSortFields.currentStreak,
        });
        expect(soloStreaks.length).toBeGreaterThanOrEqual(1);

        const soloStreak = soloStreaks[0];

        expect(Object.keys(soloStreak).sort()).toEqual(
            [
                'status',
                'currentStreak',
                'completedToday',
                'active',
                'pastStreaks',
                '_id',
                'streakName',
                'streakDescription',
                'userId',
                'timezone',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );
    });
});
