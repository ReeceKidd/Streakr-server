import { isTestEnvironment } from './setup/isTestEnvironment';
import { setupDatabase } from './setup/setupDatabase';
import { tearDownDatabase } from './setup/tearDownDatabase';
import { Mongoose } from 'mongoose';
import { disconnectDatabase } from './setup/disconnectDatabase';
import { getPayingUser } from './setup/getPayingUser';
import { StreakoidSDK } from '../src/SDK/streakoidSDKFactory';
import { streakoidTestSDKFactory } from '../src/SDK/streakoidTestSDKFactory';

jest.setTimeout(120000);

const testName = 'GET-incomplete-solo-streak-tasks';

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

    test(`IncompleteSoloStreakTasks can be retrieved`, async () => {
        expect.assertions(8);

        const user = await getPayingUser({ testName });
        const userId = user._id;
        const streakName = 'Reading';

        const soloStreak = await SDK.soloStreaks.create({
            userId,
            streakName,
        });

        const soloStreakId = soloStreak._id;

        // Solo streak tasks must be completed before they can be incompleted

        await SDK.completeSoloStreakTasks.create({
            userId,
            soloStreakId,
        });

        await SDK.incompleteSoloStreakTasks.create({
            userId,
            soloStreakId,
        });

        const incompleteSoloStreakTasks = await SDK.incompleteSoloStreakTasks.getAll({
            userId,
            streakId: soloStreakId,
        });

        const incompleteSoloStreakTask = incompleteSoloStreakTasks[0];

        expect(incompleteSoloStreakTask._id).toEqual(expect.any(String));
        expect(incompleteSoloStreakTask.userId).toBeDefined();
        expect(incompleteSoloStreakTask.streakId).toEqual(soloStreakId);
        expect(incompleteSoloStreakTask.taskIncompleteTime).toEqual(expect.any(String));
        expect(incompleteSoloStreakTask.taskIncompleteDay).toEqual(expect.any(String));
        expect(incompleteSoloStreakTask.createdAt).toEqual(expect.any(String));
        expect(incompleteSoloStreakTask.updatedAt).toEqual(expect.any(String));
        expect(Object.keys(incompleteSoloStreakTask).sort()).toEqual(
            [
                '_id',
                'userId',
                'streakId',
                'taskIncompleteTime',
                'taskIncompleteDay',
                'createdAt',
                'updatedAt',
                '__v',
            ].sort(),
        );
    });
});
