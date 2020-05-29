import { isTestEnvironment } from './setup/isTestEnvironment';
import { tearDownDatabase } from './setup/tearDownDatabase';
import { getPayingUser } from './setup/getPayingUser';
import { Mongoose } from 'mongoose';
import { setupDatabase } from './setup/setupDatabase';
import { disconnectDatabase } from './setup/disconnectDatabase';
import { StreakoidSDK } from '@streakoid/streakoid-sdk/lib/streakoidSDKFactory';
import { streakoidTestSDK } from './setup/streakoidTestSDK';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import { GetAllSoloStreaksSortFields } from '../src/SDK/soloStreaks';

jest.setTimeout(120000);

const testName = 'GET-solo-streaks';

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

    test(`solo streaks can be retrieved with user query parameter`, async () => {
        expect.assertions(15);

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const streakName = 'Daily Spanish';
        const streakDescription = 'Everyday I must do Spanish';
        await SDK.soloStreaks.create({
            userId,
            streakName,
            streakDescription,
        });

        const soloStreaks = await SDK.soloStreaks.getAll({ userId });
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
        expect(soloStreak.timezone).toBeDefined();
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

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const streakName = 'Daily Spanish';
        const streakDescription = 'Everyday I must do Spanish';
        await SDK.soloStreaks.create({
            userId,
            streakName,
            streakDescription,
        });

        const newSoloStreak = await SDK.soloStreaks.create({
            userId,
            streakName,
        });

        // Simulate an incomplete solo streak
        await SDK.soloStreaks.update({
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

        const soloStreaks = await SDK.soloStreaks.getAll({
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

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const streakName = '30 minutes of reading';
        const streakDescription = 'Every day I must do 30 minutes of reading';
        await SDK.soloStreaks.create({
            userId,
            streakName,
            streakDescription,
        });

        const secondSoloStreak = await SDK.soloStreaks.create({
            userId,
            streakName,
            streakDescription,
        });
        const secondSoloStreakId = secondSoloStreak._id;

        await SDK.completeSoloStreakTasks.create({
            userId,
            soloStreakId: secondSoloStreakId,
        });

        const soloStreaks = await SDK.soloStreaks.getAll({
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

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const streakName = '30 minutes of reading';
        const streakDescription = 'Every day I must do 30 minutes of reading';
        const createdSoloStreak = await SDK.soloStreaks.create({
            userId,
            streakName,
            streakDescription,
        });

        await SDK.soloStreaks.update({
            soloStreakId: createdSoloStreak._id,
            updateData: { status: StreakStatus.archived },
        });

        const soloStreaks = await SDK.soloStreaks.getAll({
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

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const streakName = '30 minutes of reading';
        const streakDescription = 'Every day I must do 30 minutes of reading';
        const createdSoloStreak = await SDK.soloStreaks.create({
            userId,
            streakName,
            streakDescription,
        });

        await SDK.soloStreaks.update({
            soloStreakId: createdSoloStreak._id,
            updateData: { status: StreakStatus.deleted },
        });

        const soloStreaks = await SDK.soloStreaks.getAll({
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

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const streakName = '30 minutes of reading';
        const streakDescription = 'Every day I must do 30 minutes of reading';
        await SDK.soloStreaks.create({
            userId,
            streakName,
            streakDescription,
        });

        const soloStreaks = await SDK.soloStreaks.getAll({
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
